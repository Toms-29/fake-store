import jwt from 'jsonwebtoken'
import { SECRET_TOKEN_KEY } from '../config.js'

export const createAccessToken = (payload: object) => {
    return new Promise((resolve, reject) => {
        jwt.sign(
            payload,
            SECRET_TOKEN_KEY,
            { expiresIn: '1d' },
            (err, token) => {
                if (err) reject(err)
                resolve(token)
            }
        )
    })

}