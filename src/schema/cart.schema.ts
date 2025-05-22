import { z } from "zod"

export const QuantityOfProductToCartSchema = z.object({
    quantity: z.number().nonnegative().int().min(1)
})

export const ResponseCartSchema = z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    products: z.string(), // CAMBIAR A ARRAY DE PRODUCTOS
    totalPrice: z.number().nonnegative()
})