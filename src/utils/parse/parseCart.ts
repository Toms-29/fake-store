import { ResponseCartSchema } from "../../schema/index.js";

export const parseCart = (cart: any) => {
    return ResponseCartSchema.parse({
        id: cart._id.toString(),
        userId: cart.userId.toString(),
        products: cart.products.map((p: any) => ({
            id: p.productId._id?.toString?.() || p.productId.toString(),
            quantity: p.quantity
        })),
        totalPrice: cart.totalPrice
    })
}