import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose";
import { User } from "./User.model.js"
import { Product } from "./Product.model.js"

class cartProduct {
    @prop({ ref: () => Product, required: true })
    productId: Ref<Product>

    @prop({ required: true })
    quantity: number
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Cart {
    @prop({ ref: () => User, required: true })
    userId: Ref<User>

    @prop({ type: () => [cartProduct], required: true, _id: false })
    products: cartProduct[]

    @prop({ required: true, trim: true })
    totalPrice: number

}

const CartModel = getModelForClass(Cart)
export default CartModel