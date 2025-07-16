import { Request, Response, NextFunction } from "express"

import jwt from "jsonwebtoken"
import User from "../models/User.model.js"
import { createAccessToken, createRefreshToken } from "../lib/jwt.js"
import { HttpError } from "../errors/HttpError.js"
import { ENV } from "../config/env.js"

export const refreshToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { refreshToken } = req.cookies
        if (!refreshToken) { throw new HttpError("No refresh token", 401) }

        const payload = jwt.verify(refreshToken, ENV.SECRET_REFRESH_TOKEN_KEY) as ({ id: string })

        const user = await User.findById(payload.id)
        if (!user || user.refreshToken !== refreshToken) { throw new HttpError("Invalid refresh token", 403) }

        const newRefreshToken = createRefreshToken({ id: user._id })
        const newAccessToken = createAccessToken({ id: user._id, role: user.role })

        user.refreshToken = newRefreshToken
        await user.save()

        res
            .cookie('token', newAccessToken, { httpOnly: true, secure: true })
            .cookie('refreshToken', newRefreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 })
            .status(200)
            .json({ message: "Tokens refreshed" })
    } catch (error) {
        next(error)
    }
}