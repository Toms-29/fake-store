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
    rating: PositiveInteger.optional(),
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
    rating: PositiveInteger,
    amount: PositiveInteger,
    status: ProductStatusSchema,
    images: z.array(z.string().url()).max(5, "Max five images allowed").optional()
})

export const ProductQuerySchema = z.object({
    productName: ProductName,
    status: ProductStatusSchema.optional(),
    minPrice: z.preprocess((val) => Number(val), z.number().min(0)).optional(),
    maxPrice: z.preprocess((val) => Number(val), z.number().min(0)).optional(),
    category: z.enum(["tech", "learn", "sport", "tools", "garden", "furniture", "kitchen"]).optional(),
    sortBy: z.enum(["price", "rating", "createdAt"]).optional(),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.preprocess((val) => Number(val), z.number().int().min(1)).optional(),
    limit: z.preprocess((val) => Number(val), z.number().int().min(1).max(100)).optional()
})