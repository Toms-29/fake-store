import { prop, getModelForClass, modelOptions } from "@typegoose/typegoose"
import { User } from "./User.model.js"
import { Product } from "./Product.model.js"
import type { Ref } from "@typegoose/typegoose"
import { CartStatus } from "../types/cart.types.js"
import { Cart } from "./Cart.model.js"

class OrderItem {
    @prop({ required: true, ref: () => Product })
    productId: Ref<Product>

    @prop({ required: true })
    quantity: number

    @prop({ required: true })
    price: number
}

@modelOptions({ schemaOptions: { timestamps: true } })
export class Order {
    @prop({ required: true, ref: () => User, index: true })
    userId: Ref<User>

    @prop({ required: true })
    email: string

    @prop({ required: true, ref: () => Cart })
    cartId: Ref<Cart>

    @prop({ required: true, type: () => [OrderItem] })
    products: OrderItem[]

    @prop({ required: true })
    totalPrice: number

    @prop({ required: true, unique: true })
    paymentId: string

    @prop({ enum: CartStatus, default: CartStatus.CONFIRMED })
    status: CartStatus

    @prop({ default: false, index: true })
    isDeleted: boolean

    @prop({ default: null })
    deletedAt?: Date | null
}

const OrderModel = getModelForClass(Order)
export default OrderModel