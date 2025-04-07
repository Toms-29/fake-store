import { Request, Response } from "express"
import Comment from "../models/Comment.model.js"

export const addComment = async (req: Request, res: Response) => {
    const { productId } = req.params
    const { text } = req.body

    try {
        const newComment = new Comment(
            {
                productId: productId,
                userId: req.user.id,
                text
            }
        )

        const commentSaved = await newComment.save()

        res.send(commentSaved)

    } catch (error) {
        res.status(500).json({ message: error })

    }
}

export const getProductComments = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const commentsFound = await Comment.find({ productId: id })

        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        res.json(commentsFound)
    } catch (error) {
        res.status(500).json({ message: error })
    }

}

export const getUserComments = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const commentsFound = await Comment.find({ userId: id })

        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        res.json(commentsFound)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const deleteComment = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const commentsFound = await Comment.findByIdAndDelete(id)

        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        res.json(commentsFound)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

