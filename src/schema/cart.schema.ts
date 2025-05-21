import { z } from "zod"

export const QuantityOfProductToCartSchema = z.object({
    quantity: z.number().nonnegative().int().min(1)
})

export const ParamsIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" })
})