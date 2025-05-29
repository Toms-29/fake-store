import { z } from 'zod'
import { ObjectIdSchema } from './common.schema.js'

export const AddProductSchema = z.object({
    productName: z.string().nonempty({ message: "Product name is required" }),
    description: z.string().nonempty({ message: "Description is required" }).max(500, { message: "Description must be less than 500 characters" }),
    price: z.number().positive({ message: "Price must be a positive number" }),
    amount: z.number().int().positive({ message: "Amount must be a positive integer" }),
    images: z.array(z.string().url()).optional()
})

export const ProductUpdateSchema = z.object({
    productName: z.string().optional(),
    description: z.string().optional(),
    comments: z.array(ObjectIdSchema).optional(),
    price: z.number().positive({ message: "Price must be a positive number" }).optional(),
    calification: z.number().min(0).max(5, { message: "Calification must be between 0 and 5" }).optional(),
    amount: z.number().int().positive({ message: "Amount must be a positive integer" }).optional(),
    status: z.enum(["in_stock", "out_of_stock", "pending"]).optional(),
    images: z.array(z.string().url()).optional()
})

export const ResponseProductSchema = z.object({
    _id: ObjectIdSchema,
    productName: z.string().nonempty({ message: "Product name is required" }),
    description: z.string().nonempty({ message: "Description is required" }).max(500, { message: "Description must be less than 500 characters" }),
    comments: z.array(ObjectIdSchema).optional(),
    price: z.number().positive({ message: "Price must be a positive number" }),
    calification: z.number().min(0).max(5, { message: "Calification must be between 0 and 5" }).optional(),
    amount: z.number().int().positive({ message: "Amount must be a positive integer" }),
    status: z.enum(["in_stock", "out_of_stock", "pending"]),
    images: z.array(z.string().url()).optional()
})