import { z } from "zod"
import { ObjectIdSchema, RoleSchema } from "./common.schema.js"

export const RegisterUserSchema = z.object({
    userName: z.string().nonempty(),
    email: z.string().email(),
    password: z.string().min(6)
})

export const LoginUserSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6)
})

export const ResponseAuthUserSchema = z.object({
    _id: z.string(ObjectIdSchema),
    userName: z.string().nonempty(),
    email: z.string().email(),
    role: RoleSchema
})