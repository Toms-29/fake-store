import { getModelForClass, modelOptions, prop, index, plugin } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose"
import { Product } from "./Product.model.js";
import { User } from "./User.model.js";
import { softDeletePlugin } from "../middlewares/softDeletePlugin.js";

@plugin(softDeletePlugin)
@modelOptions({ schemaOptions: { timestamps: true } })
@index({ userId: 1, productId: 1 }, { unique: true })
export class Comment {
    @prop({ ref: 'Product', required: true, index: true })
    productId: Ref<Product>

    @prop({ ref: () => User, required: true, index: true })
    userId: Ref<User>

    @prop({ required: true, trim: true, maxlength: 200 })
    text: string

    @prop({ default: false, index: true })
    isDeleted: boolean

    @prop({ default: null })
    deletedAt?: Date | null
}

const CommentModel = getModelForClass(Comment)
export default CommentModel