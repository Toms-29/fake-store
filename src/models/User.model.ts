import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import { UserRole } from "../types/user.types.js"

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {

    @prop({ required: true, trim: true, maxlength: 30, minlength: 1 })
    userName: string

    @prop({ required: true, trim: true, unique: true })
    email: string

    @prop({ required: true, enum: UserRole, default: UserRole.USER })
    role: UserRole

    @prop({ required: true, trim: true, maxlength: 100, minlength: 6 })
    password: string

}

const UserModel = getModelForClass(User)
export default UserModel