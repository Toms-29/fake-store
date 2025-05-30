import jwt from 'jsonwebtoken'
import { Types } from "mongoose"
import { ENV } from '../config/env.js'


export const createAccessToken = (payload: { id: Types.ObjectId, role: string }) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            ENV.SECRET_TOKEN_KEY,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) reject(err)
                resolve(token)
            }
        )
    })

}