import { z } from "zod"
import { ObjectIdSchema, TimeStampsSchema } from "./common.schema.js"

export const UserName = z.string().trim().nonempty("User name is required").min(1).max(15).regex(/^[a-zA-Z0-9-_]+$/, "Solo letras, números, guiones y guiones bajos")

export const EmailSchema = z.string().trim().email()

export const RoleSchema = z.enum(["admin", "user"], { errorMap: () => ({ message: "Invalid role" }) })

export const PasswordSchema = z.string().trim().min(6).max(32)

export const RegisterUserSchema = z.object({
    userName: UserName,
    email: EmailSchema,
    password: PasswordSchema
})

export const LoginUserSchema = z.object({
    email: EmailSchema,
    password: PasswordSchema
})

export const ResponseAuthUserSchema = z.object({
    id: ObjectIdSchema,
    userName: UserName,
    email: EmailSchema,
    role: RoleSchema,
}).merge(TimeStampsSchema)