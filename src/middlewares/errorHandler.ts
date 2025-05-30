import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

import { ENV } from '../config/env.js'
import { HttpError } from '../errors/HttpError.js'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
        console.error(err)
        res.status(400).json({
            message: "Validation Error",
            errors: err.errors.map(e => e.message),
            ...(ENV.NODE_ENV === "development" && { stack: err.stack })
        })
    }

    const statusCode = err instanceof HttpError ? err.statusCode : 500
    const message = err instanceof HttpError ? err.message : "Internal Server Error"
    console.error(err)
    res.status(statusCode).json({
        message: message,
        ...(ENV.NODE_ENV === "development" && { stack: err.stack })
    })
}