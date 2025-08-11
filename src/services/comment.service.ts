import Comment from "../models/Comment.model.js"
import { restoreById, softDeleteById } from "../utils/softDeleteActions.js"

export const softDeleteComment = async (id: string) => {
    return softDeleteById(Comment, id)
}

export const restoreComment = async (id: string) => {
    return restoreById(Comment, id)
}