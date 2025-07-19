import { ResponseOrderSchema } from "../../schema"

export const parseOrder = (order: any) => {
    return ResponseOrderSchema.parse({
        id: order._id.toString(),
        userId: order.userId.toString(),
        email: order.email,
        cartId: order.cartId.toString(),
        products: Array.isArray(order.products)
            ? order.products
                .filter((p: any) => p?.productId && p?.quantity)
                .map((p: any) => ({
                    productId: {
                        id: p.productId._id.toString(),
                        productName: p.productId.productName
                    },
                    quantity: p.quantity,
                    price: p.price
                }))
            : [],
        totalPrice: order.totalPrice,
        paymentId: order.paymentId.toString(),
        status: order.status,
        createdAt: order.createdAt
    })
}