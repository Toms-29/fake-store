import { Response, Request, NextFunction } from "express"

import Rating from "../models/Rating.model.js"
import Product from "../models/Product.model.js"
import { ObjectIdSchema } from "../schema/common.schema.js"
import { RateSchema } from "../schema/product.schema.js"


export const rateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id
        const productId = ObjectIdSchema.parse(req.params.productId)
        const rating = RateSchema.parse(req.body.rating)

        await Rating.findOneAndUpdate(
            { userId, productId },
            { rating },
            { upsert: true, new: true }
        )

        const ratings = await Rating.find({ productId })
        const avg = ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length

        await Product.findByIdAndUpdate(productId, { rating: avg })

        res.status(200).json({ message: "Rating updated", average: avg })
    } catch (error) {
        next(error)
    }
}