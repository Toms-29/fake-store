import { Request, Response, NextFunction } from 'express'
import Role from '../models/Role.model.js'
import User from '../models/User.model.js'
import { HttpError } from '../errors/HttpError.js'

export const requestRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id
    const { currentRole, requestRole, reason } = req.body

    try {
        const newRole = new Role(
            {
                userId,
                currentRole,
                requestRole,
                reason
            }
        )

        const savedRole = await newRole.save()
        res.status(201).json({
            message: 'Role change request created successfully',
            data: savedRole
        })
    } catch (error) {
        next(error)
    }
}

export const aceptRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const queryRole = await Role.findById(id)
        if (!queryRole) { throw new HttpError("Request not found", 404) }

        const userId = queryRole.userId

        const updatedRole = await User.findByIdAndUpdate(
            userId,
            { $set: { role: queryRole.requestRole } },
            { new: true }
        )
        if (!updatedRole) { throw new HttpError("User not found", 404) }

        await Role.findByIdAndDelete(id)

        res.status(200).json(updatedRole)
    } catch (error) {
        next(error)
    }
}

export const rejectRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    try {
        const queryRole = await Role.findByIdAndDelete(id)
        if (!queryRole) { throw new HttpError("Request not found", 404) }

        res.status(200).json({ message: "Request deleted successfully" })
    } catch (error) {
        next(error)
    }
}

export const getRequestsRoleChange = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const requests = await Role.find()
        if (!requests) { throw new HttpError("Request not found", 404) }

        res.status(200).json(requests)
    } catch (error) {
        next(error)
    }
}

export const getRequestRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params

    try {
        const request = await Role.findOne({ userId: userId })
        if (!request) { throw new HttpError("Request not found", 404) }

        res.status(200).json(request)
    } catch (error) {
        next(error)
    }
}