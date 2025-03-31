import jwt from 'jsonwebtoken';
import { SECRET_TOKEN_KEY } from '../config.js';
import { NextFunction, Request, Response } from 'express';

declare module 'express-serve-static-core' {
    interface Request {
        user?: any
    }

}

export const authRequired = (req: Request, res: Response, next: NextFunction): void => {
    const { token } = req.cookies

    if (!token) { res.status(401).json({ message: "Unauthorized" }); return }

    jwt.verify(token, SECRET_TOKEN_KEY, (err: jwt.VerifyErrors | null, user: any) => {
        if (err) { res.status(403).json({ message: "Denied acces" }); return }

        req.user = user

        next()
    })

}