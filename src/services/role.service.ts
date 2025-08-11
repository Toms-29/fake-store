import Role from "../models/Role.model.js"
import { restoreById, softDeleteById } from "../utils/softDeleteActions.js"

export const softDeleteRole = async (id: string) => {
    return softDeleteById(Role, id)
}

export const restoreRole = async (id: string) => {
    return restoreById(Role, id)
}