import { z } from "zod";

export const IdParamSchema = z.object({
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" }).optional(),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" }).optional(),
    commentId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" }).optional(),
    cartId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" }).optional(),
    orderId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" }).optional(),
    requestId: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" }).optional()
}).refine(data => data.productId || data.userId || data.commentId || data.cartId || data.orderId || data.requestId, {
    message: "Id is required"
})

export const NameParamSchema = z.object({
    userName: z.string().nonempty("User name is required").optional(),
    productName: z.string().nonempty("User name is required").optional()
}).refine(data => data.productName || data.userName, {
    message: "Name is required"
})