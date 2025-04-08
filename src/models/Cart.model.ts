import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })
export class Cart {
    @prop({ required: true, trim: true })
    userId: string

    @prop({ ref: "CartOrder", required: true, trim: true })
    products: string[]

    @prop({ required: true, trim: true })
    totalPrice: number

}

const CartModel = getModelForClass(Cart)
export default CartModel