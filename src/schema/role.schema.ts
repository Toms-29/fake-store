import { z } from "zod";
import { DeleteStatusSchema, ObjectIdSchema, TimeStampsSchema } from "./common.schema.js";
import { RoleSchema } from "./user.schema.js"

export const RequestStatusSchema = z.enum(["accepted", "pending", "rejected"]);

export const BaseRoleSchema = z.object({
    id: ObjectIdSchema,
    userId: ObjectIdSchema,
    currentRole: RoleSchema,
    requestRole: RoleSchema,
    reason: z.string().trim().nonempty({ message: "Reason is required" }).min(20).max(300),
    status: RequestStatusSchema,
}).merge(TimeStampsSchema).merge(DeleteStatusSchema).strict()

export const RequestRoleChangeSchema = BaseRoleSchema.pick({ currentRole: true, requestRole: true, reason: true }).strict()

export const ResponseRoleSchema = BaseRoleSchema.omit({ isDeleted: true, deletedAt: true }).strict().readonly()