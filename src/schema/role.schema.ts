import { z } from "zod";

export const RoleSchema = z.object({
    _id: z.string().regex(/^[0-9a-fA-F]{24}$/, { message: "Invalid ObjectId" }),
    userId: z.string().nonempty({ message: "User ID is required" }),
    requestRole: z.enum(["admin", "user"], { errorMap: () => ({ message: "Invalid role" }) }),
    currentRole: z.enum(["admin", "user"], { errorMap: () => ({ message: "Invalid role" }) }),
    reason: z.string().nonempty({ message: "Reason is required" })
})