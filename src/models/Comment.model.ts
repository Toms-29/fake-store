import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";
import type { Ref } from "@typegoose/typegoose"
import { Product } from "./Product.model.js";
import { User } from "./User.model.js";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Comment {
    @prop({ ref: 'Product', required: true })
    productId: Ref<Product>

    @prop({ ref: () => User, required: true })
    userId: Ref<User>

    @prop({ required: true, trim: true, maxlength: 200 })
    text: string

}

const CommentModel = getModelForClass(Comment)
export default CommentModel                 