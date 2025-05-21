import { z } from "zod";

export const updatedUserSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }).optional(),
    userName: z.string().nonempty({ message: "User name is required" }).optional(),
    password: z.string().min(6, { message: "Password must be at least 6 characters long" }).optional()
})