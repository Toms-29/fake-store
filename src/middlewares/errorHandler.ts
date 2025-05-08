import { Request, Response, NextFunction } from 'express'
import { HttpError } from '../errors/HttpError.js'

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {
    const statusCode = err instanceof HttpError ? err.statusCode : 500
    const message = err instanceof HttpError ? err.message : "Internal Server Error"
    res.status(statusCode).json({ message: message })
}