import User from "../models/User.model.js"
import { restoreById, softDeleteById } from "../utils/softDeleteActions.js"

export const softDeleteUser = async (id: string) => {
    return softDeleteById(User, id)
}

export const restoreUser = async (id: string) => {
    return restoreById(User, id)
}