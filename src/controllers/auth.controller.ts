import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/User.model.js'
import { createAccessToken } from '../lib/jwt.js'
import { RegisterUserSchema, LoginUserSchema } from "../schema/auth.schema.js"
import { ObjectIdSchema } from "../schema/common.schema.js"
import { HttpError } from '../errors/HttpError.js'
import { parseUser } from '../utils/parse/parseUser.js'

interface UserRequest {
    _id: string,
    userName: string,
    email: string,
    role: string,
    createdAt: string,
    updatedAt: string,
}

export const register = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName, email, password } = RegisterUserSchema.parse(req.body)

        const userExists = await User.findOne({ email: email })

        if (userExists) {
            if (!userExists.isDeleted) { throw new HttpError("User already exist", 400) }

            userExists.userName = userName
            userExists.password = await bcrypt.hash(password, 10)
            userExists.isDeleted = false

            const userSaved = await userExists.save()

            const token = await createAccessToken({ id: userSaved._id, role: userSaved.role })
            res.cookie('token', token)

            const userParsed = parseUser(userSaved)

            res.status(200).json(userParsed)
            return
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            userName,
            email,
            password: passwordHash
        })
        const userSaved = await newUser.save()

        const token = await createAccessToken({ id: userSaved._id, role: userSaved.role })
        res.cookie('token', token)

        const userParsed = parseUser(userSaved)

        res.status(200).json(userParsed)
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = LoginUserSchema.parse(req.body)

        const userFound = await User.findOne({ email: email, isDeleted: false })
        if (!userFound) { throw new HttpError("User not found", 404) }

        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) { throw new HttpError("Invalid credentials ", 400) }

        const token = await createAccessToken({ id: userFound._id, role: userFound.role })
        res.cookie('token', token)

        const userParsed = parseUser(userFound)

        res.status(200).json(userParsed)
    } catch (error) {
        next(error)
    }
}

export const logout = (_req: Request, res: Response) => {
    res.cookie('token', "", { expires: new Date(0) })
    res.status(200).json({ message: 'Logout success' })
}

export const profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.user.id)

        const userFound = await User.findOne({ _id: userId, isDeleted: false }) as UserRequest
        if (!userFound) { throw new HttpError("User not found", 404) }

        const userParsed = parseUser(userFound)

        res.status(200).json(userParsed)
    } catch (error) {
        next(error)
    }
}