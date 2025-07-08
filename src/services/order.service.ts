import Product from "../models/Product.model.js"
import Order from "../models/Order.model.js"
import Cart from "../models/Cart.model.js"
import { HttpError } from "../errors/HttpError.js"
import { CartType } from "../types/cart.types.js"
import { Types } from "mongoose"
import { updateFileds } from "./product.service.js"

export const confirmPurchase = async (id: string) => {
    const cart = await Cart.findById(id).populate('products.productId').lean() as CartType;
    if (!cart) { throw new HttpError("Cart not found", 404); }

    await Promise.all(
        cart.products.map((item) => {
            updateFileds({
                id: item.productId._id.toString(),
                quantity: item.quantity,
                operation: 'decrease'
            })
        }));
}

export const createOrderFromStripeSession = async (session: any) => {
    const orderExist = await Order.findOne({ paymentId: session.id })
    if (orderExist) { throw new HttpError("Order already exist", 409) }

    if (session.line_items?.data.length === 0) { throw new HttpError("No items in the cart", 400) }

    const userId = Types.ObjectId.createFromHexString(session.metadata.userId)
    const email = session.metadata.email
    const cartId = Types.ObjectId.createFromHexString(session.metadata.cartId)


    const products = await Promise.all(session.line_items.data.map(async (item: any) => {
        const mongoProductId = item.price.product.metadata.mongoProductId

        const product = await Product.findById(mongoProductId)
        if (!product) { throw new HttpError("Product not found", 404) }

        return {
            productId: Types.ObjectId.createFromHexString(mongoProductId),
            quantity: item.quantity,
            price: item.price.unit_amount / 100
        }
    }))

    const totalPrice = session.amount_total / 100
    const paymentId = session.id

    try {
        const order = new Order({
            userId,
            email,
            cartId,
            products,
            totalPrice,
            paymentId,
        })
        const orderSaved = await order.save()

        return orderSaved
    } catch (error) {
        console.error("Error creating order:", error)
        throw new HttpError("Failed to create order", 500)
    }
}

export const restoreProductsFromCart = async (session: any) => {
    const lineItems = session.line_items?.data
    if (!lineItems || lineItems.length === 0) { throw new HttpError("Session without data", 400) }

    await Promise.all(
        lineItems.map((item: any) => {
            updateFileds({
                id: item.price.product.metadata.mongoProductId,
                quantity: item.quantity,
                operation: 'increase'
            })
        }))
}