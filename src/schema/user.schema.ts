import { z } from "zod"
import { DeleteStatusSchema, ObjectIdSchema, TimeStampsSchema } from "./common.schema.js"

export const UserNameSchema = z.string().trim().nonempty("User name is required").min(1).max(15).regex(/^[a-zA-Z0-9-_]+$/, "Solo letras, números, guiones y guiones bajos")

export const EmailSchema = z.object({ email: z.string().trim().email() })

export const RoleSchema = z.enum(["admin", "user"], { errorMap: () => ({ message: "Invalid role" }) })

export const PasswordSchema = z.object({ password: z.string().trim().min(6).max(32) })

export const BaseUserSchema = z.object({
    id: ObjectIdSchema,
    userName: UserNameSchema,
    role: RoleSchema,
    refreshToken: z.string().optional(),
    resetPasswordToken: z.string().optional(),
    resetPasswordExpires: z.string().optional(),
}).merge(TimeStampsSchema).merge(DeleteStatusSchema).merge(EmailSchema).merge(PasswordSchema).strict()

export const RegisterUserSchema = BaseUserSchema.pick({ userName: true, email: true, password: true }).strict()

export const LoginUserSchema = BaseUserSchema.pick({ email: true, password: true }).strict()

export const updatedUserSchema = BaseUserSchema.pick({ userName: true, email: true, password: true }).partial()

export const ResponseAuthUserSchema = BaseUserSchema.pick({ id: true, userName: true, email: true, role: true, createdAt: true, updatedAt: true }).strict().readonly()

export const UserNameQuerySchema = z.object({ userName: UserNameSchema }).strict()