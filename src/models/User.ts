import { prop, getModelForClass } from "@typegoose/typegoose"

class User {

    @prop()
    id: string
    
    @prop()
    userName: string
    
    @prop()
    email: string
    
    @prop()
    password: string
    
    @prop()
    dateCreated: string
    
    @prop()
    dateUpdated: string

}

const UserModel = getModelForClass(User)
export default UserModel