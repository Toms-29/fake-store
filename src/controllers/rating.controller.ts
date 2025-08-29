import { Response, Request, NextFunction } from "express"

import Rating from "../models/Rating.model.js"
import Product from "../models/Product.model.js"
import { HttpError } from "../errors/HttpError.js"

export const rateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id
        const { productId } = req.params
        const { rating } = req.body

        const existingRating = await Rating.findOne({ userId, productId }, { userRating: true })
        const product = await Product.findById(productId, { ratingCuantity: true, rating: true })
        if (!product) { throw new HttpError("Product not found", 404) }


        if (existingRating) {
            const newRating = Number((((product.rating - existingRating.userRating) + rating) / product.ratingCuantity).toFixed(1))

            existingRating.userRating = rating
            await existingRating.save()

            await Product.findByIdAndUpdate(productId, { rating: newRating })

        } else {
            const newRating = Number(((product.rating + rating) / (product.ratingCuantity + 1)).toFixed(1))

            await Rating.create({ userId, productId, userRating: rating })

            await Product.findByIdAndUpdate(
                productId,
                { rating: newRating, ratingCuantity: product.ratingCuantity + 1 },
                { new: true }
            )
        }

        res.status(200).json({ message: "Qualification successfully completed" })
    } catch (error) {
        next(error)
    }
}