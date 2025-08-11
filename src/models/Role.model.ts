import { modelOptions, getModelForClass, prop, plugin, } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { User } from "./User.model.js";
import { queryStatus } from "../types/role.types.js";
import { UserRole } from "../types/user.types.js";
import { softDeletePlugin } from "../middlewares/softDeletePlugin.js";

@plugin(softDeletePlugin)
@modelOptions({ schemaOptions: { timestamps: true } })
export class Role {
    @prop({ required: true, ref: () => User, index: true })
    userId: Ref<User>

    @prop({ required: true, enum: UserRole })
    currentRole: UserRole

    @prop({ required: true, enum: UserRole })
    requestRole: UserRole

    @prop({ required: true, minlength: 20, maxlength: 300 })
    reason: string

    @prop({ required: true, enum: queryStatus, default: queryStatus.PENDING })
    status: queryStatus

    @prop({ default: false, index: true })
    isDeleted: boolean

    @prop({ default: null })
    deletedAt?: Date | null
}

const RoleModel = getModelForClass(Role)
export default RoleModel