import { modelOptions, prop } from "@typegoose/typegoose";

@modelOptions({ schemaOptions: { timestamps: true } })
export class Comment {
    @prop()
    productId: string

    @prop()
    userId: string

    @prop()
    text: string

}