import { z } from "zod"

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
    id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" }),
    userName: z.string().nonempty(),
    email: z.string().email(),
    role: z.enum(["user", "admin"])
})