import { getModelForClass, modelOptions, prop, plugin } from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose";
import { User } from "./User.model.js"
import { Product } from "./Product.model.js"
import { CartStatus } from "../types/cart.types.js";
import { softDeletePlugin } from "../middlewares/softDeletePlugin.js";

class cartProduct {
    @prop({ ref: () => Product, required: true })
    productId: Ref<Product>

    @prop({ required: true })
    quantity: number
}

@plugin(softDeletePlugin)
@modelOptions({ schemaOptions: { timestamps: true } })
export class Cart {
    @prop({ ref: () => User, required: true, index: true })
    userId: Ref<User>

    @prop({ type: () => [cartProduct], required: true, _id: false })
    products: cartProduct[]

    @prop({ required: true })
    totalPrice: number

    @prop({ required: true, enum: CartStatus, default: CartStatus.PENDING })
    status: CartStatus

    @prop({ default: false, index: true })
    isDeleted: boolean

    @prop({ default: null })
    deletedAt?: Date | null
}

const CartModel = getModelForClass(Cart)
export default CartModel