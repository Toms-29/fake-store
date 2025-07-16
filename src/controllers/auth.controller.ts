import { NextFunction, Request, Response } from 'express'
import bcrypt from 'bcryptjs'

import User from '../models/User.model.js'
import { createAccessToken, createRefreshToken } from '../lib/jwt.js'
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

            const token = createAccessToken({ id: userExists._id, role: userExists.role })
            const refreshToken = createRefreshToken({ id: userExists._id })

            userExists.userName = userName
            userExists.password = await bcrypt.hash(password, 10)
            userExists.isDeleted = false
            userExists.refreshToken = refreshToken
            await userExists.save()

            const userParsed = parseUser(userExists)

            res
                .cookie("token", token, { httpOnly: true, secure: true })
                .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 })
                .status(200)
                .json(userParsed)
            return
        }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            userName,
            email,
            password: passwordHash
        })

        const token = createAccessToken({ id: newUser._id, role: newUser.role })
        const refreshToken = createRefreshToken({ id: newUser._id })

        newUser.refreshToken = refreshToken

        await newUser.save()

        const userParsed = parseUser(newUser)

        res
            .cookie("token", token, { httpOnly: true, secure: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 })
            .status(200)
            .json(userParsed)
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
        const refreshToken = await createRefreshToken({ id: userFound._id })

        userFound.refreshToken = refreshToken
        await userFound.save()

        const userParsed = parseUser(userFound)

        res
            .cookie("token", token, { httpOnly: true, secure: true })
            .cookie("refreshToken", refreshToken, { httpOnly: true, secure: true, sameSite: "strict", maxAge: 7 * 24 * 60 * 60 * 1000 })
            .status(200)
            .json(userParsed)
    } catch (error) {
        next(error)
    }
}

export const logout = async (req: Request, res: Response) => {
    const { refreshToken } = req.cookies
    if (refreshToken) {
        const user = await User.findOne({ refreshToken })
        if (user) {
            user.refreshToken = undefined
            await user.save()
        }
    }

    res
        .clearCookie("token")
        .clearCookie("refreshToken")
        .status(200)
        .json({ message: 'Logout success' })
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