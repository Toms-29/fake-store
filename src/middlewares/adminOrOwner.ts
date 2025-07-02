import { Request, Response, NextFunction } from "express"

import { HttpError } from "../errors/HttpError.js"

type AccesCondition = "admin" | "owner" | "ownerOrAdmin"

export const isOwnerOrAdminFactory = (condition: AccesCondition, getResourceOwnerId?: (req: Request) => string) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        const user = req.user

        if (!user) { throw new HttpError("unauthorized", 401) }


        if (condition === "admin" && user.role === "admin") return next()


        if (condition === "owner" && getResourceOwnerId) {
            const ownerId = getResourceOwnerId(req)
            if (user.id === ownerId) return next()
        }

        if (condition === "ownerOrAdmin" && getResourceOwnerId) {
            const ownerId = getResourceOwnerId(req)
            if (user.id === ownerId || user.role === "admin") return next()
        }

        throw new HttpError("denied access", 403)
    }
}