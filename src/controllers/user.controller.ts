import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import User from "../models/User.model.js";
import { ObjectIdSchema, NameParamSchema } from "../schema/common.schema.js";
import { updatedUserSchema } from "../schema/user.schema.js"
import { ResponseAuthUserSchema } from "../schema/auth.schema.js"

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.body)

        const { userId } = req.body

        const userFound = await User.findOne({ _id: userId }, { password: false })
        if (!userFound) { res.status(404).json({ message: "User not found" }); return }

        const parsedUser = ResponseAuthUserSchema.parse({
            id: userFound._id.toString(),
            userName: userFound.userName,
            email: userFound.email,
            role: userFound.role
        })

        res.status(200).json(parsedUser)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        NameParamSchema.parse(req.body)

        const { userName } = req.body

        const usersFound = await User.find({ userName: userName }, { password: false })
        if (!usersFound) { res.status(404).json({ message: "Users not found" }); return }

        const parsedUsers = usersFound.map(user => {
            return ResponseAuthUserSchema.parse({
                id: user._id.toString(),
                userName: user.userName,
                email: user.email,
                role: user.role
            })
        })

        res.status(200).json(parsedUsers)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        updatedUserSchema.parse(req.body)

        const { userId, email, userName, password } = req.body

        const updatedUser = await User.findOneAndUpdate(
            { _id: userId },
            {
                email,
                userName,
                password
            },
            { new: true }
        ).select({ password: false })
        if (!updatedUser) { res.status(404).json({ message: "User not found" }); return }

        const parsedUser = ResponseAuthUserSchema.parse({
            id: updatedUser._id.toString(),
            userName: updatedUser.userName,
            email: updatedUser.email,
            role: updatedUser.role
        })

        res.status(200).json(parsedUser)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.body)

        const { userId } = req.body

        const deletedUser = await User.findOneAndDelete({ _id: userId })
        if (!deletedUser) { res.status(404).json({ message: "User not found" }); return }

        res.status(200).json({ message: "User deleted" })
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}