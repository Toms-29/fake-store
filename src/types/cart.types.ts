import { Types } from "mongoose"

export type CartType = {
    _id: string | Types.ObjectId,
    userId: string | Types.ObjectId,
    products: ProductsType[],
    totalPrice: number
}

export type ProductsType = {
    productId: ProductType | Types.ObjectId,
    quantity: number
}

export type ProductType = {
    _id: string | Types.ObjectId,
    description: string,
    comments?: Types.ObjectId[],
    price: number,
    calification: number
    amount: number,
    status: string
}

export enum CartStatus {
    CONFIRMED = 'confirmed',
    PENDING = 'pending',
    REJECTED = 'rejected'
}