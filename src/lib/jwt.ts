import { sign } from 'jsonwebtoken'
import { Types } from "mongoose"
import { ENV } from '../config/env.js'


export const createAccessToken = (payload: { id: Types.ObjectId, role: string }): string => {
    return sign(payload, ENV.SECRET_TOKEN_KEY, { expiresIn: '15m' })
}

export const createRefreshToken = (payload: { id: Types.ObjectId }): string => {
    return sign(payload, ENV.SECRET_REFRESH_TOKEN_KEY, { expiresIn: '7d' })
}