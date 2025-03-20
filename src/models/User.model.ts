import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })
export class User {

    @prop()
    id: string

    @prop()
    userName: string

    @prop()
    email: string

    @prop()
    password: string

}

const UserModel = getModelForClass(User)
export default UserModel