import rateLimit from "express-rate-limit"

export const createRateLimiter = (time: number, attempts: number, message: string = "Too many requests, try again later.") => {
    return rateLimit({
        windowMs: time * 60 * 1000,
        max: attempts,
        message: { message: message },
        standardHeaders: true,
        legacyHeaders: false,
    })
}