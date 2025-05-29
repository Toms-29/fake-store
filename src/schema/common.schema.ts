import { z } from "zod";

export const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" })

export const RoleSchema = z.enum(["admin", "user"], { errorMap: () => ({ message: "Invalid role" }) })

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
    userName: z.string().nonempty("User name is required").optional(),
    productName: z.string().nonempty("User name is required").optional()
}).refine(data => data.productName || data.userName, {
    message: "Name is required"
})