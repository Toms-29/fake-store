import { Request, Response, NextFunction } from "express";
import bcrypt from 'bcryptjs'

import User from "../models/User.model.js";
import { ObjectIdSchema, updatedUserSchema, UserNameQuerySchema } from "../schema";
import { HttpError } from "../errors/HttpError.js";
import { parseUser } from "../utils/parse/parseUser.js";

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.params.userId).toString()

        if (req.user.role !== "admin" && req.user.id !== userId) { throw new HttpError("Forbidden", 403) }

        const userFound = await User.findOne({ _id: userId, isDeleted: false }, { password: false })
        if (!userFound) { throw new HttpError("User not found", 404) }

        const parsedUser = parseUser(userFound)

        res.status(200).json(parsedUser)
    } catch (error) {
        next(error)
    }
}

export const getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userName } = UserNameQuerySchema.partial().parse(req.query)

        const query: any = {}
        if (userName) { query.userName = { $regex: userName, $options: "i" } }

        const usersFound = await User.find({ ...query, isDeleted: false }, { password: false })
        if (usersFound.length === 0) {
            const message = userName ? `No users found matching '${userName}'` : "No users found"
            throw new HttpError(message, 404)
        }

        const parsedUsers = usersFound.map(user => parseUser(user))

        res.status(200).json(parsedUsers)
    } catch (error) {
        next(error)
    }
}

export const updateUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.params.userId).toString()
        const updateFields = updatedUserSchema.parse(req.body)

        if (req.user.role !== "admin" && req.user.id !== userId) { throw new HttpError("Forbidden", 403) }

        if (updateFields.password) {
            const passwordHash = await bcrypt.hash(updateFields.password, 10)
            updateFields.password = passwordHash
        }

        if (updateFields.email) {
            const email = await User.findOne({ email: updateFields.email, _id: { $ne: userId } })
            if (email) { throw new HttpError("Email already in use", 409) }
        }

        const updatedUser = await User.findOneAndUpdate({ _id: userId }, updateFields, { new: true }).select({ password: false })
        if (!updatedUser) { throw new HttpError("User not found", 404) }

        const parsedUser = parseUser(updatedUser)

        res.status(200).json(parsedUser)
    } catch (error) {
        next(error)
    }
}

export const deleteUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.params.userId).toString()

        if (req.user.role !== "admin" && req.user.id !== userId) { throw new HttpError("Forbidden", 403) }

        const deletedUser = await User.findByIdAndUpdate(userId, {
            isDeleted: true,
            deletedAt: new Date()
        })
        if (!deletedUser) { throw new HttpError("User not found", 404) }

        res.status(200).json({ message: "User deleted" })
    } catch (error) {
        next(error)
    }
}