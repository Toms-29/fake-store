import { z } from "zod";
import { ObjectIdSchema } from "./common.schema.js";
import { RoleSchema } from "./common.schema.js"

export const RequestRoleChangeSchema = z.object({
    requestRole: RoleSchema,
    currentRole: RoleSchema,
    reason: z.string().nonempty({ message: "Reason is required" })
})

export const ResponseRoleSchema = z.object({
    _id: z.string(ObjectIdSchema),
    userId: z.string().nonempty({ message: "User ID is required" }),
    requestRole: RoleSchema,
    currentRole: RoleSchema,
    reason: z.string().nonempty({ message: "Reason is required" })
})