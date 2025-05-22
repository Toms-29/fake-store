import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/User.model.js'
import { createAccessToken } from '../lib/jwt.js'

export const register = async (req: Request, res: Response, next: NextFunction) => {
    const { userName, email, password } = req.body

    try {
        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            userName,
            email,
            password: passwordHash
        })
        if (!newUser) { res.status(400).json({ message: 'Invalid data' }); return }
        const userSaved = await newUser.save()

        const token = await createAccessToken({ id: userSaved._id, role: userSaved.role })

        res.cookie('token', token)
        res.json(userSaved)
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body

    try {
        const userFound = await User.findOne({ email: email })
        if (!userFound) { res.status(400).json({ message: 'User not found' }); return }

        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) { res.status(400).json({ message: 'Invalid credentials' }); return }

        const token = await createAccessToken({ id: userFound._id, role: userFound.role })

        res.cookie('token', token)
        res.json(userFound)
    } catch (error) {
        next(error)
    }
}

export const logout = (_req: Request, res: Response) => {
    res.cookie('token', "", { expires: new Date(0) })
    res.status(200).json({ message: 'Logout success' })
}

export const profile = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id

    try {
        const userFound = await User.findById(userId)
        if (!userFound) { res.status(400).json({ message: "User not found" }); return }

        res.json(userFound)
    } catch (error) {
        next(error)
    }
}