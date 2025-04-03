import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Comment {
    @prop({ ref: 'Product', required: true })
    productId: string

    @prop({ ref: 'User', required: true })
    userId: string

    @prop({ required: true, trim: true, maxlength: 200 })
    text: string

}

const CommentModel = getModelForClass(Comment)
export default CommentModel                 