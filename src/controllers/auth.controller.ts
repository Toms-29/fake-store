import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/User.model.js'
import { createAccessToken } from '../lib/jwt.js'
import { RegisterUserSchema, LoginUserSchema, ResponseAuthUserSchema } from "../schema/auth.schema.js"
import { ObjectIdSchema } from "../schema/common.schema.js"
import { HttpError } from '../errors/HttpError.js'

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
        if (userExists) { throw new HttpError("User already exist", 400) }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            userName,
            email,
            password: passwordHash
        })
        const userSaved = await newUser.save()

        const token = await createAccessToken({ id: userSaved._id, role: userSaved.role })
        res.cookie('token', token)

        const userParsed = ResponseAuthUserSchema.parse({
            id: userSaved._id.toString(),
            userName: userSaved.userName,
            email: userSaved.email,
            role: userSaved.role
        })
        res.json(userParsed)
    } catch (error) {
        next(error)
    }
}

export const login = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = LoginUserSchema.parse(req.body)

        const userFound = await User.findOne({ email: email })
        if (!userFound) { throw new HttpError("User not found", 404) }

        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) { throw new HttpError("Invalid credentials ", 400) }

        const token = await createAccessToken({ id: userFound._id, role: userFound.role })
        res.cookie('token', token)

        const userParsed = ResponseAuthUserSchema.parse({
            id: userFound._id.toString(),
            userName: userFound.userName,
            email: userFound.email,
            role: userFound.role
        })
        res.json(userParsed)
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

        const userFound = await User.findById(userId) as UserRequest
        if (!userFound) { throw new HttpError("User not found", 404) }

        const userParsed = ResponseAuthUserSchema.parse({
            id: userFound._id.toString(),
            userName: userFound.userName,
            email: userFound.email,
            role: userFound.role,
            createdAt: userFound.createdAt,
            updatedAt: userFound.updatedAt,
        })
        res.json(userParsed)
    } catch (error) {
        next(error)
    }
}