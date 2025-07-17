import { z } from "zod";
import { ObjectIdSchema } from "./common.schema.js";
import { RoleSchema } from "./auth.schema.js"

export const RequestStatusSchema = z.enum(["acepted", "pending", "rejected"]);

export const RequestRoleChangeSchema = z.object({
    requestRole: RoleSchema,
    currentRole: RoleSchema,
    reason: z.string().trim().nonempty({ message: "Reason is required" }).min(20).max(300)
})

export const ResponseRoleSchema = z.object({
    id: ObjectIdSchema,
    userId: ObjectIdSchema,
    requestRole: RoleSchema,
    currentRole: RoleSchema,
    reason: z.string().trim().nonempty({ message: "Reason is required" }),
    status: RequestStatusSchema
})