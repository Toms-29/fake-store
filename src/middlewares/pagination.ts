import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { ProductQuerySchema } from "../schema"

type ProductQuery = z.infer<typeof ProductQuerySchema>

export const paginationMiddleware = (req: Request, _res: Response, next: NextFunction) => {
    const query = req.query as Partial<ProductQuery>

    const sortField = query.sortBy || "createdAt"
    const sortOrder = query.order === "asc" ? 1 : -1

    const page = query.page || 1
    const limit = query.limit || 10
    const skip = (page - 1) * limit

    req.pagination = { page, limit, skip, sortField, sortOrder }

    next()
}