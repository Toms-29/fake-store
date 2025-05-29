import { Request, Response, NextFunction } from "express"
import { ZodError } from "zod"

import Comment from "../models/Comment.model.js"
import Product from "../models/Product.model.js"
import { ResponseCommentSchema, TextOfCommentSchema } from "../schema/comment.schema.js"
import { ObjectIdSchema } from "../schema/common.schema.js"

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.params.productId)
        TextOfCommentSchema.parse(req.body.text)

        const { productId } = req.params
        const { text } = req.body

        const newComment = new Comment(
            {
                productId: productId,
                userId: req.user.id,
                text
            })
        const commentSaved = await newComment.save()

        const commentParsed = ResponseCommentSchema.parse({
            id: commentSaved._id.toString(),
            productId: commentSaved.productId,
            userId: commentSaved.userId,
            text: commentSaved.text
        })

        await Product.findByIdAndUpdate(
            productId,
            {
                $push: { comments: commentSaved._id }
            })

        res.status(201).json(commentParsed)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const getProductComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.params.productId)

        const { productId } = req.params

        const commentsFound = await Comment.find({ productId: productId }).populate("productId", "productName").lean()
        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        const commentsParsed = commentsFound.map(comment => {
            return ResponseCommentSchema.parse({
                id: comment._id.toString(),
                productId: comment.productId,
                userId: comment.userId,
                text: comment.text
            })
        })

        res.json(commentsParsed)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const getUserComments = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.user.id)

        const userId = req.user.id

        const commentsFound = await Comment.find({ userId: userId }).populate("userId", "userName").lean()
        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        const commentsParsed = commentsFound.map(comment => {
            return ResponseCommentSchema.parse({
                id: comment._id.toString(),
                productId: comment.productId,
                userId: comment.userId,
                text: comment.text
            })
        })

        res.json(commentsParsed)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.params.id)

        const { id } = req.params

        const commentsFound = await Comment.findByIdAndDelete(id)
        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        await Product.findOneAndUpdate(
            { comments: id },
            {
                $pull: { comments: id }
            })

        res.json(commentsFound)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}