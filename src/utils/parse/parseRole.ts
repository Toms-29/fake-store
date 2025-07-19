import { ResponseRoleSchema } from "../../schema";

export const parseRole = (role: any) => {
    return ResponseRoleSchema.parse({
        id: role._id.toString(),
        userId: role.userId.toString(),
        requestRole: role.requestRole,
        currentRole: role.currentRole,
        reason: role.reason,
        status: role.status,
        createdAt: role.createdAt,
        updatedAt: role.updatedAt
    })
}