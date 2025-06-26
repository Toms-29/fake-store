import { ResponseCommentSchema } from "../schema/comment.schema.js";

export const parseComment = (comment: any) => {
    return ResponseCommentSchema.parse({
        id: comment._id.toString(),
        productId: comment.productId,
        userId: comment.userId,
        text: comment.text
    })
}