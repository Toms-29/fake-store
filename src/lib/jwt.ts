import jwt from 'jsonwebtoken'
import { ENV } from '../config/env.js'


export const createAccessToken = (payload: object) => {
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