import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
    @prop()
    productName: string

    @prop()
    description: string

    @prop({ ref: "Comment" })
    comment?: string[]

    @prop()
    price: number

    @prop()
    calification: number

}

const ProductModel = getModelForClass(Product)
export default ProductModel