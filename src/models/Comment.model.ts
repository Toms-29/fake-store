import { modelOptions, prop } from "@typegoose/typegoose";
import { Product } from "./Product.model.js"
import { User } from "./User.model.js"

@modelOptions({ schemaOptions: { timestamps: true } })
export class Comment {
    @prop({ ref: () => Product })
    productId: Product

    @prop({ ref: () => User })
    userId: User

    @prop()
    text: string

}