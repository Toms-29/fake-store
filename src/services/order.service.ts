import Product from "../models/Product.model.js"
import Order from "../models/Order.model.js"
import Cart from "../models/Cart.model.js"
import { HttpError } from "../errors/HttpError.js"
import { CartType } from "../types/cart.types.js"
import { ProductType } from "../types/product.types.js"
import { ProductStatus } from "../types/product.types.js"
import { Types } from "mongoose"


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


export const confirmPurchase = async (id: string) => {
    const cartFound = await Cart.findById(id).populate('products.productId').lean() as CartType;
    if (!cartFound) { throw new HttpError("Cart not found", 404); }

    const updatedProducts = await Promise.all(cartFound.products.map(async (cartItem) => {
        const product = cartItem.productId as ProductType;
        const id = product._id.toString();
        const quantity = cartItem.quantity;
        const newAmount = product.amount - quantity;

        if (newAmount < 0) { throw new HttpError("Insufficient amount", 409); }

        const updateFields: Partial<ProductType> = {
            amount: newAmount,
        };

        if (newAmount === 0) {
            updateFields.status = ProductStatus.OUT_OF_STOCK;
        }

        return await Product.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );
    }));
    return updatedProducts;
};