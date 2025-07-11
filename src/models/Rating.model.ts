import { getModelForClass, prop, modelOptions, index } from "@typegoose/typegoose"
import type { Ref } from "@typegoose/typegoose"
import { Product } from "./Product.model.js"
import { User } from "./User.model.js"

@modelOptions({ schemaOptions: { timestamps: true } })
@index({ userId: 1, productId: 1 }, { unique: true })
export class Rating {
    @prop({ ref: () => Product, required: true })
    productId: Ref<Product>

    @prop({ ref: () => User, required: true })
    userId: Ref<User>

    @prop({ required: true, min: 1, max: 5 })
    rating: number
}

const RatingModel = getModelForClass(Rating)
export default RatingModel