import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })
export class Product {
    @prop({ required: true, trim: true, maxlength: 150 })
    productName: string

    @prop({ required: true, trim: true, maxlength: 500 })
    description: string

    @prop({ ref: "Comment" })
    comment?: string[]

    @prop({ required: true, trim: true })
    price: number

    @prop({ required: true, trim: true })
    calification: number

    @prop({ required: true, trim: true })
    amount: number

}

const ProductModel = getModelForClass(Product)
export default ProductModel