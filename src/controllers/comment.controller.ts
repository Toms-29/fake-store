import { Request, Response, NextFunction } from "express"

import Comment from "../models/Comment.model.js"
import Product from "../models/Product.model.js"

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params
    const { text } = req.body

    try {
        const newComment = new Comment(
            {
                productId: productId,
                userId: req.user.id,
                text
            })
        const commentSaved = await newComment.save()

        await Product.findByIdAndUpdate(
            productId,
            {
                $push: { comments: commentSaved._id }
            })

        res.status(201).json(commentSaved)
    } catch (error) {
        next(error)
    }
}

export const getProductComments = async (req: Request, res: Response, next: NextFunction) => {
    const { productId } = req.params

    try {
        const commentsFound = await Comment.find({ productId: productId }).populate("productId", "productName").lean()
        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        res.json(commentsFound)
    } catch (error) {
        next(error)
    }
}

export const getUserComments = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id

    try {
        const commentsFound = await Comment.find({ userId: userId }).populate("userId", "userName").lean()
        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        res.json(commentsFound)
    } catch (error) {
        next(error)
    }
}

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const commentsFound = await Comment.findByIdAndDelete(id)
        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        await Product.findOneAndUpdate(
            { comments: id },
            {
                $pull: { comments: id }
            })

        res.json(commentsFound)
    } catch (error) {
        next(error)
    }
}