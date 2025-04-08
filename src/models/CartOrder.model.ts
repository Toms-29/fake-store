import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })
export class CartOrder {

    @prop({ ref: "Product", required: true, trim: true })
    products: string

    @prop({ required: true, trim: true })
    quantity: number

}

const CartOrderModel = getModelForClass(CartOrder)
export default CartOrderModel