import { z } from "zod";
import { EmailSchema, PasswordSchema, UserName } from "./auth.schema.js"

export const updatedUserSchema = z.object({
    userName: UserName.optional(),
    email: EmailSchema,
    password: PasswordSchema
})

export const UserNameQuerySchema = z.object({
    userName: UserName
})