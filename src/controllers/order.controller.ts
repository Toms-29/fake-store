import { Response, Request, NextFunction } from "express"

import Order from "../models/Order.model.js"
import { ObjectIdSchema } from "../schema/common.schema.js"
import { HttpError } from "../errors/HttpError.js"
import { parseOrder } from "../utils/parse/parseOrder.js"


export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.user.id)

        const orders = await Order.find({ userId: userId }).populate({
            path: "products.productId",
            select: "_id productName"
        }).lean()
        if (orders.length === 0) { throw new HttpError("Orders not found", 404) }

        const parsedOrders = orders.map(order => parseOrder(order))

        res.status(200).json(parsedOrders)
    } catch (error) {
        next(error)
    }

}

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const orderId = ObjectIdSchema.parse(req.params.id)

        const order = await Order.findById(orderId).populate({
            path: "products.productId",
            select: "_id productName"
        }).lean()
        if (!order) { throw new HttpError("Order not found", 404) }

        const parsedOrder = parseOrder(order)

        res.status(200).json(parsedOrder)
    } catch (error) {
        next(error)
    }
}