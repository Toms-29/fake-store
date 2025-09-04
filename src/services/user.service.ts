import User from "../models/User.model.js"
import { restoreById, softDeleteById } from "../utils/softDeleteActions.js"

export const softDeleteUser = async (id: string, context?: string) => {
    return softDeleteById(User, id, context)
}

export const restoreUser = async (id: string, context?: string) => {
    return restoreById(User, id, context)
}