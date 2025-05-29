import { Request, Response, NextFunction } from 'express'
import { ZodError } from 'zod'

import Role from '../models/Role.model.js'
import User from '../models/User.model.js'
import { HttpError } from '../errors/HttpError.js'
import { ObjectIdSchema } from '../schema/common.schema.js'
import { RequestRoleChangeSchema, ResponseRoleSchema } from "../schema/role.schema.js"

export const requestRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.user.id)
        RequestRoleChangeSchema.parse(req.body)

        const userId = req.user.id
        const { currentRole, requestRole, reason } = req.body

        const newRole = new Role({
            userId,
            currentRole,
            requestRole,
            reason
        })
        const savedRole = await newRole.save()

        const parsedRequest = ResponseRoleSchema.parse({
            id: savedRole._id.toString(),
            userId: savedRole.userId,
            requestRole: savedRole.requestRole,
            currentRole: savedRole.currentRole,
            reason: savedRole.reason
        })

        res.status(201).json({
            message: 'Role change request created successfully',
            data: parsedRequest
        })
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const aceptRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.user.id)

        const { requestId } = req.params

        const queryRole = await Role.findById(requestId)
        if (!queryRole) { throw new HttpError("Request not found", 404) }

        const userId = queryRole.userId

        const updatedRole = await User.findByIdAndUpdate(
            userId,
            { $set: { role: queryRole.requestRole } },
            { new: true }
        )
        if (!updatedRole) { throw new HttpError("User not found", 404) }

        const parsedRequest = ResponseRoleSchema.parse(updatedRole)

        await Role.findByIdAndDelete(requestId)

        res.status(200).json(parsedRequest)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const rejectRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.user.id)

        const { requestId } = req.params

        const queryRole = await Role.findByIdAndDelete(requestId)
        if (!queryRole) { throw new HttpError("Request not found", 404) }

        res.status(200).json({ message: "Request deleted successfully" })
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const getRequestsRoleChange = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const requests = await Role.find()
        if (!requests) { throw new HttpError("Request not found", 404) }

        const parsedRequests = requests.map(request => ResponseRoleSchema.parse({
            id: request._id.toString(),
            userId: request.userId,
            requestRole: request.requestRole,
            currentRole: request.currentRole,
            reason: request.reason
        }))

        res.status(200).json(parsedRequests)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const getRequestRoleChange = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.user.id)

        const { userId } = req.params

        const request = await Role.findOne({ userId: userId })
        if (!request) { throw new HttpError("Request not found", 404) }

        const parsedRequest = ResponseRoleSchema.parse({
            id: request._id.toString(),
            userId: request.userId,
            requestRole: request.requestRole,
            currentRole: request.currentRole,
            reason: request.reason
        })

        res.status(200).json(parsedRequest)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}