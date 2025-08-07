import { z } from "zod";
import { DeleteStatusSchema, ObjectIdSchema, TimeStampsSchema } from "./common.schema.js";
import { UserNameSchema } from "./user.schema.js";

export const TextOfCommentSchema = z.object({
    text: z.string().nonempty("Text is required").min(5).max(200, "Text must be less than 500 characters")
})

export const BaseCommentSchema = z.object({
    id: ObjectIdSchema,
    productId: ObjectIdSchema,
    userId: ObjectIdSchema,
    text: TextOfCommentSchema
}).merge(TimeStampsSchema).merge(DeleteStatusSchema).strict()

export const CommentedBySchema = z.object({
    id: ObjectIdSchema,
    text: TextOfCommentSchema,
    userName: UserNameSchema
})

export const ResponseCommentSchema = BaseCommentSchema.omit({ isDeleted: true, deletedAt: true }).strict().readonly()