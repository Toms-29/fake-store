import { z } from "zod";

export const TextOfCommentSchema = z.object({
    text: z.string().nonempty("Text is required").max(500, "Text must be less than 500 characters")
})

export const ResponseCommentSchema = z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/),
    productId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    userId: z.string().regex(/^[0-9a-fA-F]{24}$/),
    text: TextOfCommentSchema
})