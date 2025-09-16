import { prop, getModelForClass, modelOptions, plugin } from "@typegoose/typegoose"
import { UserRole } from "../types/user.types.js"
import { softDeletePlugin } from "../middlewares/softDeletePlugin.js"
import { userChangeLogPlugin } from "../middlewares/userChangeLogPlugin.js"

@plugin(softDeletePlugin)
@plugin(userChangeLogPlugin)
@modelOptions({ schemaOptions: { timestamps: true } })
export class User {
    @prop({ required: true, trim: true, maxlength: 15, minlength: 1, index: true })
    userName: string

    @prop({ required: true, trim: true, unique: true, index: true })
    email: string

    @prop({ required: true, enum: UserRole, default: UserRole.USER })
    role: UserRole

    @prop({ required: true, trim: true, maxlength: 32, minlength: 6 })
    password: string

    @prop({ default: null })
    refreshToken?: string | null

    @prop({ default: null })
    resetPasswordToken?: string | null

    @prop({ default: null })
    resetPasswordExpires?: Date | null

    @prop({ default: false, index: true })
    isDeleted: boolean

    @prop({ default: null })
    deletedAt?: Date | null
}

const UserModel = getModelForClass(User)
export default UserModel