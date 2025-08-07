import { z } from 'zod'
import { DeleteStatusSchema, ObjectIdSchema, PositiveFloat, PositiveInteger, TimeStampsSchema } from './common.schema.js'
import { CommentedBySchema } from './comment.schema.js'

export const RateSchema = z.object({ rating: z.number().min(1).max(5) })

export const ProductName = z.string().trim().nonempty("Product name is required").min(3).max(100).regex(/^[a-zA-Z0-9-_]+$/, "Solo letras, números, guiones y guiones bajos")

export const ProductStatusSchema = z.enum(["in_stock", "out_of_stock", "pending"])

export const BaseProductSchema = z.object({
    id: ObjectIdSchema,
    productName: ProductName,
    description: z.string().trim().nonempty({ message: "Description is required" }).min(10).max(500, { message: "Description must be less than 500 characters" }),
    price: PositiveFloat,
    rating: PositiveInteger,
    amount: PositiveInteger,
    status: ProductStatusSchema,
    images: z.array(z.string().url()).max(5, "Max five images allowed").optional()
}).merge(TimeStampsSchema).merge(DeleteStatusSchema).strict()

export const AddProductSchema = BaseProductSchema.pick({ productName: true, description: true, price: true, amount: true, images: true }).strict()

export const ProductUpdateSchema = BaseProductSchema.pick({ productName: true, description: true, price: true, rating: true, amount: true, status: true, images: true }).partial()

export const ResponseProductSchema = BaseProductSchema.extend({
    comments: z.array(CommentedBySchema.omit({ id: true })).optional()
}).omit({ isDeleted: true, deletedAt: true }).strict().readonly()

export const ProductQuerySchema = z.object({
    productName: ProductName,
    status: ProductStatusSchema,
    minPrice: z.preprocess((val) => Number(val), z.number().min(0)),
    maxPrice: z.preprocess((val) => Number(val), z.number().min(0)),
    category: z.enum(["tech", "learn", "sport", "tools", "garden", "furniture", "kitchen"]),
    sortBy: z.enum(["price", "rating", "createdAt"]),
    order: z.enum(["asc", "desc"]).optional(),
    page: z.preprocess((val) => Number(val), z.number().int().min(1)),
    limit: z.preprocess((val) => Number(val), z.number().int().min(1).max(100))
}).partial().required({ productName: true })