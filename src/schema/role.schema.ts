import { z } from "zod";
import { ObjectIdSchema } from "./common.schema.js";
import { RoleSchema } from "./common.schema.js"

export const RequestRoleChangeSchema = z.object({
    requestRole: RoleSchema,
    currentRole: RoleSchema,
    reason: z.string().nonempty({ message: "Reason is required" })
})

export const ResponseRoleSchema = z.object({
    id: ObjectIdSchema,
    userId: ObjectIdSchema,
    requestRole: RoleSchema,
    currentRole: RoleSchema,
    reason: z.string().nonempty({ message: "Reason is required" }),
    status: z.enum(["acepted", "pending","rejected"])
})