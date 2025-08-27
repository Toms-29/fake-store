import { ResponseAuthUserSchema } from "../../schema/index.js"

export const parseUser = (user: any) => {
    return ResponseAuthUserSchema.parse({
        id: user._id.toString(),
        userName: user.userName,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
    })
}