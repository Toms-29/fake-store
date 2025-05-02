import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import { User } from "./User.model.js"
import { Cart } from "./Cart.model.js"
import type { Ref } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })
export class Order {

    @prop({ required: true, ref: () => User })
    userId: Ref<User>

    @prop({ required: true, ref: () => Cart })
    email: Ref<Cart>

}

const OrderModel = getModelForClass(Order)
export default OrderModel