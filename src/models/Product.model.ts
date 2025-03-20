import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"
import {Comment} from "./Comment.model.js"

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
    @prop()
    productName: string

    @prop()
    description: string

    @prop({ type: () => [Comment] })
    comment: Comment[]

    @prop()
    price: number

    @prop()
    calification: number

}

const ProductModel = getModelForClass(Product)
export default ProductModel