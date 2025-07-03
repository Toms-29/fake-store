import { z } from "zod"
import { ObjectIdSchema } from "./common.schema.js"

export const QuantitySchema = z.preprocess((val) => Number(val), z.number().nonnegative().int().min(1))

export const CartItemInputSchema = z.object({
    userId: ObjectIdSchema,
    productId: ObjectIdSchema,
    quantity: QuantitySchema
})

export const ResponseCartSchema = z.object({
    id: ObjectIdSchema,
    userId: ObjectIdSchema,
    products: z.array(z.object({
        id: ObjectIdSchema,
        quantity: QuantitySchema
    })),
    totalPrice: z.number().nonnegative()
})