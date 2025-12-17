import { Request, Response, NextFunction } from "express"

import Comment from "../models/Comment.model.js"
import Product from "../models/Product.model.js"
import { parseComment } from "../utils/parse/parseComment.js"
import { HttpError } from "../errors/HttpError.js"
import { restoreComment, softDeleteComment } from "../services/comment.service.js"
import { paginateResult } from "../utils/paginateResult.js"

const productPopulate = {
    path: "productId",
    select: "productName"
}

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params
        const { text } = req.body

        const productFound = await Product.findById(productId)
        if (!productFound) { throw new HttpError("Product not found", 404) }

        const comment = await Comment.findOne({ userId: req.user._id, productId: productId })
        if (comment) { throw new HttpError("Comment already exist", 403) }

        const newComment = new Comment({
            productId: productId,
            userId: req.user.id,
            text
        })
        const commentSaved = await newComment.save()

        const commentParsed = parseComment(commentSaved)

        await Product.findByIdAndUpdate(
            productId,
            {
                $push: { comments: commentSaved._id }
            })

        res.status(201).json(commentParsed)
    } catch (error) {
        next(error)
    }
}

export const getProductComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params
        const { page, limit, skip, sortField, sortOrder } = req.pagination as { page: number, limit: number, skip: number, sortField: string, sortOrder: number }

        const { data, meta } = await paginateResult(Comment, page, limit, skip, sortField, sortOrder, { productId }, productPopulate)
        if (data.length === 0) { throw new HttpError("Comments not found", 404) }

        const commentsParsed = data.map((comment: any) => {
            return parseComment(comment)
        })

        res.status(200).json({ data: commentsParsed, meta })
    } catch (error) {
        next(error)
    }
}

export const getUserComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id

        const commentsFound = await Comment.find({ userId: userId }).populate("userId", "userName").lean()
        if (commentsFound.length === 0) { throw new HttpError("Comments not found", 404) }

        const commentsParsed = commentsFound.map(comment => {
            return parseComment(comment)
        })

        res.status(200).json(commentsParsed)
    } catch (error) {
        next(error)
    }
}

export const updateComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params
        const { text } = req.body

        const updatedComment = await Comment.findByIdAndUpdate(
            commentId,
            {
                $set: { text: text }
            }, { new: true }
        )
        if (!updatedComment) { throw new HttpError("Comment not found", 404) }

        res.status(200).json({ data: updatedComment, message: "Comment updated successfully" })
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params

        const deletedComment = softDeleteComment(commentId)
        if (!deletedComment) { throw new HttpError("Comment not found", 404) }

        res.status(200).json({ message: "Comment deleted successfully" })
    } catch (error) {
        next(error)
    }
}

export const commentRestore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { commentId } = req.params

        const restore = restoreComment(commentId)
        if (!restore) { throw new HttpError("Comment not found", 404) }

        res.status(200).json({ message: "Comment restored" })
    } catch (error) {
        next(error)
    }
}