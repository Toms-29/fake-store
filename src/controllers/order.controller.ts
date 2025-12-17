import { Response, Request, NextFunction } from "express"

import Order from "../models/Order.model.js"
import { OrderQuerySchema } from "../schema/index.js"
import { HttpError } from "../errors/HttpError.js"
import { parseOrder } from "../utils/parse/parseOrder.js"
import { z } from "zod"
import { restoreOrder, softDeleteOrder } from "../services/order.service.js"
import { paginateResult } from "../utils/paginateResult.js"

type orderQuery = z.infer<typeof OrderQuerySchema>

const productPopulate = {
    path: "products.productId",
    select: "_id productName"
}

export const getOrders = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id
        const query = req.query as orderQuery
        const { page, limit, skip, sortField, sortOrder } = req.pagination as { page: number, limit: number, skip: number, sortField: string, sortOrder: number }

        const filter: any = {}

        if (!req.user || req.user.role !== "admin") { filter.userId = userId }
        if (query.status) { filter.status = query.status }

        const { data, meta } = await paginateResult(Order, page, limit, skip, sortField, sortOrder, filter, productPopulate)
        if (data.length === 0) throw new HttpError("Orders not found", 404)

        const parsedOrders = data.map((order: any) => parseOrder(order))

        res.status(200).json({ data: parsedOrders, meta })
    } catch (error) {
        next(error)
    }

}

export const getOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params

        const order = await Order.findById(orderId).populate(productPopulate).lean()
        if (!order) { throw new HttpError("Order not found", 404) }

        const parsedOrder = parseOrder(order)

        res.status(200).json(parsedOrder)
    } catch (error) {
        next(error)
    }
}

export const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params

        const deletedOrder = softDeleteOrder(orderId)
        if (!deletedOrder) { throw new HttpError("Order not found", 404) }

        res.status(200).json({ message: "Order deleted" })
    } catch (error) {
        next(error)
    }
}

export const orderRestore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { orderId } = req.params

        const restore = restoreOrder(orderId)
        if (!restore) { throw new HttpError("Order not found", 404) }

        res.status(200).json({ message: "Order restored" })
    } catch (error) {
        next(error)
    }
}