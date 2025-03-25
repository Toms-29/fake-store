import { Request, Response } from 'express'
import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'

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

        res.json(
            {
                id: userSaved._id,
                userName: userSaved.userName,
                email: userSaved.email
            }
        )

    } catch (error) {
        console.log(error)

    }

}

export const login = (_req: Request, res: Response) => {
    console.log("login route ok")
    res.send("login route")
}