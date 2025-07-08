import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";

import User from "../models/User.model.js";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { ENV } from "../config/env.js";
import { HttpError } from "../errors/HttpError.js";
import { ObjectIdSchema } from "../schema/common.schema.js";
import { confirmPurchase } from "../services/order.service.js";


const stripe = new Stripe(ENV.STRIPE_SECRET_KEY)

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.user.id)

        const user = await User.findById(userId)
        if (!user) { throw new HttpError('User not found', 404) }

        const cart = await Cart.findOne({ userId: userId })
        if (!cart) { throw new HttpError('Cart not found', 404) }
        if (cart.products.length === 0) throw new HttpError('Cart is empty', 400)
        await confirmPurchase(cart._id.toString())

        const products = await Product.find({ _id: { $in: cart.products.map(p => p.productId) } })
        const listProducts = products.map(p => {
            const items = cart.products.filter(i => i.productId.toString() === p._id.toString())
            const quantity = items[0].quantity

            if (p.amount < quantity) { throw new HttpError("Insufficient quantity of product ", 409) }

            return {
                price_data: {
                    product_data: {
                        name: p.productName,
                        description: p.description,
                        metadata: {
                            mongoProductId: p._id.toString()
                        }
                    },
                    currency: 'usd',
                    unit_amount: p.price * 100,
                },
                quantity: quantity
            }
        })

        const session = await stripe.checkout.sessions.create({
            line_items: listProducts,
            mode: 'payment',
            success_url: ENV.STRIPE_SUCCESS_URL,
            cancel_url: ENV.STRIPE_CANCEL_URL,
            metadata: {
                userId: user._id.toString(),
                email: user.email,
                cartId: cart._id.toString()
            }
        })

        res.status(200).json(session)
    } catch (error) {
        next(error)
    }
}