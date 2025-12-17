import { Request, Response, NextFunction } from 'express'

import Role from '../models/Role.model.js'
import User from '../models/User.model.js'
import { HttpError } from '../errors/HttpError.js'
import { parseRole } from '../utils/parse/parseRole.js'
import { queryStatus } from '../types/role.types.js'
import { restoreRole, softDeleteRole } from '../services/role.service.js'
import { paginateResult } from '../utils/paginateResult.js'

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

export const getRequestsRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { page, limit, skip, sortField, sortOrder } = req.pagination as { page: number, limit: number, skip: number, sortField: string, sortOrder: number }

        const { data, meta } = await paginateResult(Role, page, limit, skip, sortField, sortOrder)
        if (!data) { throw new HttpError("Request not found", 404) }

        const parsedRequests = data.map((request: any) => parseRole(request))

        res.status(200).json({ data: parsedRequests, meta })
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

export const deleteRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId } = req.params

        const deletedRequest = softDeleteRole(requestId)
        if (!deletedRequest) { throw new HttpError("Request not found", 404) }

        res.status(200).json({ message: "Request deleted" })
    } catch (error) {
        next(error)
    }
}

export const restoreRequest = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { requestId } = req.params

        const restore = restoreRole(requestId)
        if (!restore) { throw new HttpError("Request not found", 404) }

        res.status(200).json({ message: "Request restored" })
    } catch (error) {
        next(error)
    }
}