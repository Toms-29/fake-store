import { Request, Response, NextFunction } from "express"
import Stripe from "stripe"

import { HttpError } from "../errors/HttpError.js"
import { ENV } from "../config/env.js"
import { createOrderFromStripeSession, restoreProductsFromCart } from "../services/order.service.js"

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY)


export const handleStripeWebhook = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const sig = req.headers['stripe-signature'] as string
        if (!sig) { throw new HttpError("Stripe signature missing", 400) }

        let event: Stripe.Event

        try {
            event = stripe.webhooks.constructEvent(req.body, sig, ENV.STRIPE_WEBHOOK_SECRET)
        } catch (error) {
            throw new HttpError("Invalid Stripe signature", 400)
        }



        try {
            const session = event.data.object as Stripe.Checkout.Session
            const sessionWithLineItems = await stripe.checkout.sessions.retrieve(session.id,
                { expand: ['line_items.data.price.product'] })

            switch (event.type) {
                case "checkout.session.completed":
                    await createOrderFromStripeSession(sessionWithLineItems)
                    break

                case "checkout.session.expired":
                case "checkout.session.async_payment_failed":
                    await restoreProductsFromCart(sessionWithLineItems)
                    break

                default:
                    console.log(`Unhandled event type: ${event.type}`)
                    break
            }

            res.status(200).send("Received")
        } catch (error) {
            throw new HttpError("Error processing checkout session", 500)
        }
    } catch (error) {
        next(error)
    }
}