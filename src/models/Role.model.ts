import { modelOptions, getModelForClass, prop, } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose";
import { User } from "./User.model.js";
import { queryStatus } from "../types/role.typesd.js";
import { UserRole } from "../types/user.types.js";

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
}

const RoleModel = getModelForClass(Role)
export default RoleModel