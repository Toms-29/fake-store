import { Response, Request, NextFunction } from "express"

import Order from "../models/Order.model.js"
import { ObjectIdSchema, OrderQuerySchema } from "../schema"
import { HttpError } from "../errors/HttpError.js"
import { parseOrder } from "../utils/parse/parseOrder.js"


export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.user.id)
        const query = OrderQuerySchema.parse(req.query)

        const filter: any = { userId }

        if (query.status) { filter.status = query.status }

        const sortField = query.sortBy || "createdAt"
        const sortOrder = query.order === "asc" ? 1 : -1
        const page = query.page || 1
        const limit = query.limit || 10
        const skip = (page - 1) * limit

        const orders = await Order.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limit)
            .populate({
                path: "products.productId",
                select: "_id productName"
            })
            .lean()

        if (orders.length === 0) throw new HttpError("Orders not found", 404)

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