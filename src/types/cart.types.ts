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
    comments: [],
    price: number,
    calification: number
}