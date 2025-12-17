import { Request, Response, NextFunction } from "express";

export const sanitizeQuery = (req: Request, _res: Response, next: NextFunction) => {
    const sanitize = (obj: any): any => {
        if (typeof obj !== "object" || obj === null) return obj

        return Object.keys(obj).reduce((acc: any, key) => {

            if (key.startsWith("$") || key.includes(".")) { return acc }

            let value = obj[key]

            if (typeof value === "string") {
                value = value
                    .replace(/</g, "&lt;")
                    .replace(/>/g, "&gt;")
                    .trim()
            }

            acc[key] = sanitize(value)
            return acc
        }, {})
    }

    req.query = sanitize(req.query)
    next()
}