import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose"

import { ProductStatus } from "../types/product.types.js"
import { Comment } from "./Comment.model.js"

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
    @prop({ required: true, trim: true, maxlength: 150 })
    productName: string

    @prop({ required: true, trim: true, maxlength: 500 })
    description: string

    @prop({ ref: () => Comment, default: [] })
    comments?: Ref<Comment>[]

    @prop({ required: true })
    price: number

    @prop({
        type: () => [String], validate: [
            { validator: (val: string[]) => val.every(v => /^https?:\/\//.test(v)), message: "All images must be valid URLs" },
            { validator: (val: string[]) => val.length <= 5, message: "Max five images allowed" }
        ]
    })
    images: string[]

    @prop({ required: true, min: 0, max: 5, default: 0 })
    calification: number

    @prop({ required: true })
    amount: number

    @prop({ required: true, enum: ProductStatus, default: ProductStatus.IN_STOCK })
    status: ProductStatus

}

const ProductModel = getModelForClass(Product)
export default ProductModel