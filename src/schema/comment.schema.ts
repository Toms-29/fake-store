import { z } from "zod";
import { DeleteStatusSchema, ObjectIdSchema, TimeStampsSchema } from "./common.schema.js";

export const TextOfCommentSchema = z.string().nonempty("Text is required").min(5).max(200, "Text must be less than 500 characters")

export const BaseCommentSchema = z.object({
    id: ObjectIdSchema,
    productId: ObjectIdSchema,
    userId: ObjectIdSchema,
    text: TextOfCommentSchema
}).merge(TimeStampsSchema).merge(DeleteStatusSchema).strict().required()

export const ResponseCommentSchema = BaseCommentSchema.omit({ isDeleted: true, deletedAt: true }).strict().required()