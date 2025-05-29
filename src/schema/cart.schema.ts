import { z } from "zod"
import { ObjectIdSchema } from "./common.schema.js"

export const QuantityOfProductToCartSchema = z.object({
    quantity: z.number().nonnegative().int().min(1)
})

export const ResponseCartSchema = z.object({
    _id: ObjectIdSchema,
    userId: ObjectIdSchema,
    products: z.array(z.object({
        id: ObjectIdSchema,
        quantity: z.number(QuantityOfProductToCartSchema)
    })),
    totalPrice: z.number().nonnegative()
})