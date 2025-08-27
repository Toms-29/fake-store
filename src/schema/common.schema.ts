import { z } from "zod";

export const ObjectIdSchema = z.string().trim().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" })

export const ProductName = z.string().trim().nonempty("Product name is required").min(3).max(100).regex(/^[a-zA-Z0-9-_]+$/, "Solo letras, números, guiones y guiones bajos")

export const UserNameSchema = z.string().trim().nonempty("User name is required").min(1).max(15).regex(/^[a-zA-Z0-9-_]+$/, "Solo letras, números, guiones y guiones bajos")

export const PositiveInteger = z.preprocess((val) => Number(val), z.number().positive({ message: "Must be a positive integer" }).int())

export const PositiveFloat = z.preprocess((val) => Number(val), z.number().positive({ message: "Must be a positive integer" }))

export const IdParamSchema = z.object({
    productId: ObjectIdSchema.optional(),
    userId: ObjectIdSchema.optional(),
    commentId: ObjectIdSchema.optional(),
    cartId: ObjectIdSchema.optional(),
    orderId: ObjectIdSchema.optional(),
    requestId: ObjectIdSchema.optional()
}).refine(data => data.productId || data.userId || data.commentId || data.cartId || data.orderId || data.requestId, {
    message: "Id is required"
})

export const NameParamSchema = z.object({
    userName: UserNameSchema.optional(),
    productName: ProductName.optional()
}).refine(data => data.productName || data.userName, {
    message: "Name is required"
})

export const TimeStampsSchema = z.object({
    createdAt: z.date().optional(),
    updatedAt: z.date().optional()
})

export const DeleteStatusSchema = z.object({
    isDeleted: z.boolean().default(false),
    deletedAt: z.date().nullable().optional()
})