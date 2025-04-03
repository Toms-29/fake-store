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

// export const getComment = (req: Request, res: Response) => {

// }

// export const deleteComment = (req: Request, res: Response) => {

// }

