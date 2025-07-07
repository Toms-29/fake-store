import { z } from "zod"
import { ObjectIdSchema, OrderStatusSchema, PositiveFloat, PositiveInteger, ProductName } from "./common.schema"

export const ResponseOrderSchema = z.object({
    id: ObjectIdSchema,
    userId: ObjectIdSchema,
    email: z.string().email(),
    cartId: ObjectIdSchema,
    products: z.array(z.object({
        productId: z.object({
            id: ObjectIdSchema,
            productName: ProductName,
        }),
        quantity: PositiveInteger,
        price: PositiveFloat
    })),
    totalPrice: PositiveFloat,
    paymentId: z.string().trim(),
    status: OrderStatusSchema
})
