import { z } from "zod"
import { DeleteStatusSchema, ObjectIdSchema, TimeStampsSchema } from "./common.schema.js"

export const UserNameSchema = z.string().trim().nonempty("User name is required").min(1).max(15).regex(/^[a-zA-Z0-9-_]+$/, "Solo letras, números, guiones y guiones bajos")

export const EmailSchema = z.string().trim().email()

export const RoleSchema = z.enum(["admin", "user"], { errorMap: () => ({ message: "Invalid role" }) })

export const PasswordSchema = z.string().trim().min(6).max(32)

export const BaseUserSchema = z.object({
    id: ObjectIdSchema,
    userName: UserNameSchema,
    email: EmailSchema,
    role: RoleSchema,
    password: PasswordSchema,
    refreshToken: z.string(),
    resetPasswordToken: z.string(),
    resetPasswordExpires: z.string(),
}).merge(TimeStampsSchema).merge(DeleteStatusSchema).strict().required()

export const RegisterUserSchema = BaseUserSchema.pick({ userName: true, email: true, password: true }).strict().required()

export const LoginUserSchema = BaseUserSchema.pick({ email: true, password: true }).strict().required()

export const updatedUserSchema = BaseUserSchema.pick({ userName: true, email: true, password: true }).partial()

export const ResponseAuthUserSchema = BaseUserSchema.pick({ id: true, userName: true, email: true, role: true, createdAt: true, updatedAt: true }).strict().required()

export const UserNameQuerySchema = z.object({ userName: UserNameSchema }).strict().required()