import { NextFunction, Request, Response } from "express"
import bcrypt from "bcryptjs"
import crypto from "crypto"

import User from "../models/User.model.js"
import { createAccessToken, createRefreshToken } from "../lib/jwt.js"
import { HttpError } from "../errors/HttpError.js"
import { parseUser } from "../utils/parse/parseUser.js"

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
        const { userName, email, password } = req.body

        const checkEmail = await User.findOne({ email })
        if (checkEmail) { throw new HttpError("User already exists", 400) }

        const passwordHash = await bcrypt.hash(password, 10)

        const newUser = new User({
            userName,
            email,
            password: passwordHash,
            isDeleted: false,
            deletedAt: null
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
        const { email, password } = req.body

        const userFound = await User.findOne({ email: email })
        if (!userFound) { throw new HttpError("User not found", 404) }

        const isMatch = await bcrypt.compare(password, userFound.password)
        if (!isMatch) { throw new HttpError("Invalid credentials ", 400) }

        const token = createAccessToken({ id: userFound._id, role: userFound.role })
        const refreshToken = createRefreshToken({ id: userFound._id })

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

export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email } = req.body

        const user = await User.findOne({ email })
        if (!user) { throw new HttpError("User not found", 404) }

        const token = crypto.randomBytes(32).toString('hex')
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        user.resetPasswordToken = hashedToken
        user.resetPasswordExpires = new Date(Date.now() + 10 * 60 * 1000) // 10 minutos
        await user.save()

        console.log(`Reset link: http://localhost:3000/reset-password/${token}`)

        res.status(200).json({ message: ["Request create succesfully", "Token's live is to 10 minutes"] })
    } catch (error) {
        next(error)
    }
}

export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { token } = req.params
        const { password } = req.body

        const hashedToken = crypto.createHash('sha256').update(token).digest('hex')

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: new Date() }
        })
        if (!user) throw new HttpError("Token inválido o expirado", 400)

        user.password = await bcrypt.hash(password, 10)
        user.resetPasswordToken = null
        user.resetPasswordExpires = null
        await user.save()

        res.status(200).json({ message: "Password updated" })
    } catch (error) {
        next(error)
    }
}

export const profile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id

        const userFound = await User.findOne({ _id: userId }) as UserRequest
        if (!userFound) { throw new HttpError("User not found", 404) }

        const userParsed = parseUser(userFound)

        res.status(200).json(userParsed)
    } catch (error) {
        next(error)
    }
}