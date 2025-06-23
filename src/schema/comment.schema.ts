import { z } from "zod";
import { ObjectIdSchema } from "./common.schema.js";

export const TextOfCommentSchema = z.object({
    text: z.string().nonempty("Text is required").max(500, "Text must be less than 500 characters")
})

export const ResponseCommentSchema = z.object({
    _id: ObjectIdSchema,
    productId: ObjectIdSchema,
    userId: ObjectIdSchema,
    text: z.string().nonempty().max(500)
})