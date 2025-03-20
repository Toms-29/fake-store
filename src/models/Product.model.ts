import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose"

@modelOptions({ schemaOptions: { timestamps: true } })
class Product {
    @prop()
    id: string

    @prop()
    productName: string

    @prop()
    description: string

    @prop()
    comment: string

    @prop()
    price: number

    @prop()
    calification: number

}

const ProductModel = getModelForClass(Product)
export default ProductModel