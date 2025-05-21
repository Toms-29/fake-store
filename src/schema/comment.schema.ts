import { z } from "zod";

export const TextOfCommentSchema = z.object({
    text: z.string().nonempty("Text is required").max(500, "Text must be less than 500 characters")
})

export const ParamsIdSchema = z.object({
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" })
})