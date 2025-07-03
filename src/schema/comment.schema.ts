import { z } from "zod";
import { ObjectIdSchema } from "./common.schema.js";

export const TextOfCommentSchema = z.object({
    text: z.string().nonempty("Text is required").min(5).max(200, "Text must be less than 500 characters")
})

export const ResponseCommentSchema = z.object({
    id: ObjectIdSchema,
    productId: ObjectIdSchema,
    userId: ObjectIdSchema,
    text: z.string().nonempty().min(5).max(200)
})