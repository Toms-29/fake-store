import { z } from "zod";

export const ProductDataSchema = z.object({
    price_data: z.object({
        product_data: z.object({
            name: z.string().nonempty(),
            description: z.string().nonempty()
        }),
        currency: z.enum(['usd']),
        unit_amount: z.number().nonnegative()
    }),
    quantity: z.number().int().positive()
})

export const PaymentSessionSchema = z.object({
    line_items: z.array(ProductDataSchema),
    mode: z.enum(['payment']),
    success_url: z.string().url(),
    cancel_url: z.string().url()
})