import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";

import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { ENV } from "../config/env.js";
import { ProductType } from "../types/cart.types.js";
import { HttpError } from "../errors/HttpError.js";

const stripe = new Stripe(ENV.STRIPE_SECRET_KEY)

export const createCheckoutSession = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id
    
    try {
        const cart = await Cart.findOne({ userId: userId })
        if (!cart) { throw new HttpError('Cart not found', 404) }
        
        const listProducts = await Promise.all(cart?.products.map(async (productList) => {
            let product = await Product.findById(productList.productId) as ProductType
            if (!product) { throw new HttpError('Product not found', 404) }
            
            return {
                price_data: {
                    product_data: {
                        name: product?.productName,
                        description: product?.description,
                    },
                    currency: 'usd',
                    unit_amount: product?.price * 100,
                },
                quantity: productList.quantity
            }
        }))
        if (listProducts.length === 0) { throw new HttpError('Cart is empty', 400) }
        
        const session = await stripe.checkout.sessions.create({
            line_items: listProducts,
            mode: 'payment',
            success_url: "http://localhost:4000",
            cancel_url: "http://localhost:4000"
        })
        
        res.status(200).json(session)
    } catch (error) {
        next(error)
    }
}