import { Request, Response } from 'express'
import User from '../models/User.model.js'
import bcrypt from 'bcryptjs'
import { createAccessToken } from '../lib/jwt.js'


interface UserFound {
    _id: string,
    userName: string,
    email: string,
    createdAt: Date,
    updatedAt: Date
}

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
        if (!newUser) { res.status(400).json({ message: 'Invalid data' }); return }


        const userSaved = await newUser.save()
        const token = await createAccessToken({ id: userSaved._id, role: userSaved.role })

        res.cookie('token', token)
        res.json(
            {
                id: userSaved._id,
                userName: userSaved.userName,
                email: userSaved.email,
                role: userSaved.role
            }
        )

    } catch (error) {
        res.status(500).json({ message: error })

    }

}

export const login = async (req: Request, res: Response) => {
    const { email, password } = req.body

    try {
        const userFound = await User.findOne({ email })
        if (!userFound) { res.status(400).json({ message: 'User not found' }); return }

        const isMatch = await bcrypt.compare(password, userFound?.password)
        if (!isMatch) { res.status(400).json({ message: 'Invalid credentials' }); return }

        const token = await createAccessToken({ id: userFound._id, role: userFound.role })

        res.cookie('token', token)
        res.json(
            {
                id: userFound?._id,
                userName: userFound?.userName,
                email: userFound?.email,
                role: userFound?.role
            }
        )

    } catch (error) {
        res.status(500).json({ message: error })

    }

}

export const logout = (_req: Request, res: Response) => {
    res.cookie('token', "", { expires: new Date(0) })
    res.status(200).json({ message: 'Logout success' })
}

export const profile = async (req: Request, res: Response) => {
    try {
        const userFound = (await User.findById(req.user.id)) as UserFound

        if (!userFound) { res.status(400).json({ message: "User not found" }); return }

        res.json({
            id: userFound?._id,
            userName: userFound?.userName,
            email: userFound?.email,
            createdAt: userFound?.createdAt,
            updatedAt: userFound?.updatedAt
        })
    } catch (error) {
        res.status(500).json({ message: error })
    }
}