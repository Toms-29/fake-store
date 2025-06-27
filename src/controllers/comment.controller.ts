import { Request, Response, NextFunction } from "express"

import Comment from "../models/Comment.model.js"
import Product from "../models/Product.model.js"
import { TextOfCommentSchema } from "../schema/comment.schema.js"
import { ObjectIdSchema } from "../schema/common.schema.js"
import { parseComment } from "../utils/parse/parseComment.js"
import { HttpError } from "../errors/HttpError.js"

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = ObjectIdSchema.parse(req.params.productId)
        const { text } = TextOfCommentSchema.parse(req.body)

        const productFound = await Product.findById(productId)
        if (!productFound) { throw new HttpError("Product not found", 404) }

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
        const productId = ObjectIdSchema.parse(req.params.productId)

        const commentsFound = await Comment.find({ productId: productId }).populate("productId", "productName").lean()
        if (commentsFound.length === 0) { throw new HttpError("Comments not found", 404) }

        const commentsParsed = commentsFound.map(comment => {
            return parseComment(comment)
        })

        res.status(200).json(commentsParsed)
    } catch (error) {
        next(error)
    }
}

export const getUserComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.user.id)

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

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const id = ObjectIdSchema.parse(req.params.id)

        const deletedComment = await Comment.findByIdAndDelete(id)
        if (!deletedComment) { throw new HttpError("Comments not found", 404) }

        await Product.findOneAndUpdate(
            { comments: id },
            { $pull: { comments: id } },
            { new: true })

        res.status(200).json({ message: "Comment deleted successfully" })
    } catch (error) {
        next(error)
    }
}