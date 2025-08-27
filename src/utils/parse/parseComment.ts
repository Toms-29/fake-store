import { ResponseCommentSchema } from "../../schema/index.js";

export const parseComment = (comment: any) => {
    return ResponseCommentSchema.parse({
        id: comment._id.toString(),
        productId: comment.productId.toString(),
        userId: comment.userId.toString(),
        text: comment.text,
        createdAt: comment.createdAt,
        updatedAt: comment.updatedAt
    })
}