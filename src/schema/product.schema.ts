import { z } from 'zod'

export const ProductSchema = z.object({
    productName: z.string().nonempty({ message: "Product name is required" }),
    description: z.string().nonempty({ message: "Description is required" }).max(500, { message: "Description must be less than 500 characters" }),
    comments: z.array(z.string()).optional(),
    price: z.number().positive({ message: "Price must be a positive number" }),
    calification: z.number().min(0).max(5, { message: "Calification must be between 0 and 5" }).optional(),
    amount: z.number().int().positive({ message: "Amount must be a positive integer" })
})

export const ProductUpdateSchema = z.object({
    productName: z.string().optional(),
    description: z.string().optional(),
    comments: z.array(z.string()).optional(),
    price: z.number().positive({ message: "Price must be a positive number" }).optional(),
    calification: z.number().min(0).max(5, { message: "Calification must be between 0 and 5" }).optional(),
    amount: z.number().int().positive({ message: "Amount must be a positive integer" }).optional()
})