import { Request, Response } from 'express'
import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../lib/jwt.js'


export const register = async (req: Request, res: Response) => {
    const { userName, email, password } = req.body

    try {
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User(
            {
                userName,
                email,
                password: passwordHash
            }
        )

        const userSaved = await newUser.save()
        const token = await createAccessToken({ id: userSaved._id })

        res.cookie('token', token)
        res.json(
            {
                id: userSaved._id,
                userName: userSaved.userName,
                email: userSaved.email
            }
        )

    } catch (error) {
        res.status(500).json({ message: error })

    }

}

export const login = (_req: Request, res: Response) => {
    console.log("login route ok")
    res.send("login route")
}