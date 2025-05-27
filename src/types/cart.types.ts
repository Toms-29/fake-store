import { Types } from "mongoose"
import { ProductsType } from "./product.types"

export type CartType = {
    _id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    products: ProductsType[],
    totalPrice: number
}

export enum CartStatus {
    CONFIRMED = 'confirmed',
    PENDING = 'pending',
    REJECTED = 'rejected'
}