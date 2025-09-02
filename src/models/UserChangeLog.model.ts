import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose"
import { User } from "./User.model.js"
import mongoose from "mongoose"

@modelOptions({ schemaOptions: { timestamps: true } })
export class UserChangeLog {
    @prop({ required: true, ref: () => User })
    userId!: Ref<User>

    @prop({ ref: () => User })
    changedBy?: Ref<User>

    @prop({ required: true })
    field!: string

    @prop()
    oldValue?: mongoose.Schema.Types.Mixed

    @prop()
    newValue?: mongoose.Schema.Types.Mixed
}

const UserChangeLogModel = getModelForClass(UserChangeLog)
export default UserChangeLogModel