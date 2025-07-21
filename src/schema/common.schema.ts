import { z } from "zod";
import { UserNameSchema } from "./user.schema.js";
import { ProductName } from "./product.schema.js";

export const ObjectIdSchema = z.string().trim().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" })

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