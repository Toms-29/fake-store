import { z } from "zod";
import { UserName } from "./common.schema";

export const updatedUserSchema = z.object({
    userName: UserName.optional(),
    email: z.string().trim().email({ message: "Invalid email address" }).optional(),
    password: z.string().trim().min(6, { message: "Password must be at least 6 characters long" }).max(32).optional()
})

export const UserNameQuerySchema = z.object({
    userName: UserName
})