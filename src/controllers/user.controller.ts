import { Request, Response, NextFunction } from "express";

import User from "../models/User.model.js";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body

    try {
        const userFound = await User.findOne({ _id: userId }, { password: false })
        if (!userFound) { res.status(404).json({ message: "User not found" }); return }

        res.status(200).json(userFound)
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    const { userName } = req.body

    try {
        const usersFound = await User.find({ userName: userName }, { password: false })
        if (!usersFound) { res.status(404).json({ message: "Users not found" }); return }

        res.status(200).json(usersFound)
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId, email, userName, password } = req.body

    try {
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

        res.status(200).json(updatedUser)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.body

    try {
        const deletedUser = await User.findOneAndDelete({ _id: userId })
        if (!deletedUser) { res.status(404).json({ message: "User not found" }); return }

        res.status(200).json({ message: "User deleted" })
    } catch (error) {
        next(error)
    }
}