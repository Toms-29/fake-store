import { z } from "zod"
import { ObjectIdSchema, RoleSchema, TimeStampsSchema, UserName } from "./common.schema.js"

export const RegisterUserSchema = z.object({
    userName: UserName,
    email: z.string().trim().email(),
    password: z.string().trim().min(6).max(32)
})

export const LoginUserSchema = z.object({
    email: z.string().trim().email(),
    password: z.string().trim().min(6).max(32)
})

export const ResponseAuthUserSchema = z.object({
    id: ObjectIdSchema,
    userName: UserName,
    email: z.string().trim().email(),
    role: RoleSchema,
}).merge(TimeStampsSchema)