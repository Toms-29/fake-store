import { z } from "zod"
import { DeleteStatusSchema, ObjectIdSchema, PositiveFloat, TimeStampsSchema } from "./common.schema.js"

export const QuantitySchema = z.object({
    quantityt: z.preprocess((val) => Number(val), z.number().nonnegative().int().min(1))
})

export const BaseCartSchema = z.object({
    id: ObjectIdSchema,
    userId: ObjectIdSchema,
    products: z.array(z.object({
        id: ObjectIdSchema,
    }).merge(QuantitySchema)),
    totalPrice: PositiveFloat,
    status: z.enum(["confirmed", "pending", "rejected"]),
}).merge(TimeStampsSchema).merge(DeleteStatusSchema)


export const ProductIdSchema = z.object({ productId: ObjectIdSchema })

export const ResponseCartSchema = BaseCartSchema.pick({
    id: true,
    userId: true,
    products: true,
    totalPrice: true,
    status: true
}).strict().readonly()