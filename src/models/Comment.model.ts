import { getModelForClass, modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Comment {
    @prop({ ref: "Product" })
    productId: string

    @prop({ ref: "User" })
    userId: string

    @prop()
    text: string

}

const CommentModel = getModelForClass(Comment)
export default CommentModel                 