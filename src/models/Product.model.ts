import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose"
import { Comment } from "./Comment.model.js"
import { ProductStatus } from "../types/product.types.js"

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
    @prop({ required: true, trim: true, maxlength: 150 })
    productName: string

    @prop({ required: true, trim: true, maxlength: 500 })
    description: string

    @prop({ ref: 'Comment', default: [] })
    comments?: Ref<Comment>[]

    @prop({ required: true, trim: true })
    price: number

    @prop({ required: true, trim: true })
    calification: number

    @prop({ required: true, trim: true })
    amount: number

    @prop({ required: true, enum: ProductStatus, default: ProductStatus.IN_STOCK })
    status: ProductStatus

}

const ProductModel = getModelForClass(Product)
export default ProductModel