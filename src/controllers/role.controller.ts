import { Request, Response, NextFunction } from 'express'

import Role from '../models/Role.model.js'
import User from '../models/User.model.js'
import { HttpError } from '../errors/HttpError.js'
import { parseRole } from '../utils/parse/parseRole.js'
import { queryStatus } from '../types/role.types.js'

export const requestRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.user.id
        const { currentRole, requestRole, reason } = req.body

        const newRole = new Role({
            userId,
            currentRole,
            requestRole,
            reason
        })
        const savedRole = await newRole.save()

        const parsedRequest = parseRole(savedRole)

        res.status(201).json({
            message: 'Role change request created successfully',
            data: parsedRequest
        })
    } catch (error) {
        next(error)
    }
}

export const aceptRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId } = req.params

        const queryRole = await Role.findById(requestId)
        if (!queryRole) { throw new HttpError("Request not found", 404) }

        const userId = queryRole.userId

        const updateRoleInUser = await User.findByIdAndUpdate(
            userId,
            { $set: { role: queryRole.requestRole } },
            { new: true }
        )
        if (!updateRoleInUser) { throw new HttpError("User not found", 404) }

        const updateStatusInRole = await Role.findByIdAndUpdate(
            requestId,
            { $set: { status: queryStatus.ACCEPTED } },
            { new: true }
        )
        if (!updateStatusInRole) { throw new HttpError("Role not found", 404) }

        const parsedRole = parseRole(updateStatusInRole)

        await Role.findByIdAndDelete(requestId)

        res.status(200).json(parsedRole)
    } catch (error) {
        next(error)
    }
}

export const rejectRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId } = req.params

        const queryRole = await Role.findByIdAndUpdate(
            requestId,
            { $set: { status: queryStatus.REJECTED } },
            { new: true }
        )
        if (!queryRole) { throw new HttpError("Request not found", 404) }

        res.status(200).json({ message: "Role change request rejected" })
    } catch (error) {
        next(error)
    }
}

export const getRequestsRoleChange = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const requests = await Role.find()
        if (!requests) { throw new HttpError("Request not found", 404) }

        const parsedRequests = requests.map(request => parseRole(request))

        res.status(200).json(parsedRequests)
    } catch (error) {
        next(error)
    }
}

export const getRequestRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId } = req.params

        const request = await Role.findOne({ userId: userId })
        if (!request) { throw new HttpError("Request not found", 404) }

        const parsedRequest = parseRole(request)

        res.status(200).json(parsedRequest)
    } catch (error) {
        next(error)
    }
}