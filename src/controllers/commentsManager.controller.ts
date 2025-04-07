import { Request, Response } from "express"
import Comment from "../models/Comment.model.js"

export const addComment = async (req: Request, res: Response) => {
    const { productId } = req.params
    const { text } = req.body

    console.log(productId)
    console.log(text)
    console.log(req.user.id)

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

    console.log(id)

    try {
        const commentsFound = await Comment.find({ productId: id })
        console.log(commentsFound)
        if (!commentsFound) { res.status(400).json({ message: 'Comments not found' }); return }

        res.json(commentsFound)
    } catch (error) {
        res.status(500).json({ message: error })
    }

}

// export const getUserComments = (req: Request, res: Response) => {

// }

// export const deleteComment = (req: Request, res: Response) => {

// }

