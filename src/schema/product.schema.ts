import { z } from 'zod'
import { ObjectIdSchema, PositiveFloat, PositiveInteger, ProductName, ProductStatusSchema, UserName } from './common.schema.js'

export const AddProductSchema = z.object({
    productName: ProductName,
    description: z.string().trim().nonempty({ message: "Description is required" }).min(10).max(500, { message: "Description must be less than 500 characters" }),
    price: PositiveFloat,
    amount: PositiveInteger,
    images: z.array(z.string().url()).max(5, "Max five images allowed").optional()
})

export const ProductUpdateSchema = z.object({
    productName: ProductName.optional(),
    description: z.string().trim().min(10).max(500).optional(),
    price: PositiveFloat.optional(),
    calification: PositiveInteger.optional(),
    amount: PositiveInteger.optional(),
    status: ProductStatusSchema.optional(),
    images: z.array(z.string().url()).max(5, "Max five images allowed").optional()
})

export const ResponseProductSchema = z.object({
    id: ObjectIdSchema,
    productName: ProductName,
    description: z.string().trim().nonempty({ message: "Description is required" }).min(10).max(500, { message: "Description must be less than 500 characters" }),
    comments: z.array(z.object({
        userName: UserName,
        text: z.string().trim().nonempty().max(200)
    })).optional(),
    price: PositiveFloat,
    calification: PositiveInteger,
    amount: PositiveInteger,
    status: ProductStatusSchema,
    images: z.array(z.string().url()).max(5, "Max five images allowed").optional()
})