import { Types } from "mongoose"

export type ProductsType = {
    productId: ProductType | Types.ObjectId,
    quantity: number
}

export type ProductType = {
    _id: string | Types.ObjectId,
    productName: string,
    description: string,
    comments?: Types.ObjectId[],
    price: number,
    calification: number
    amount: number,
    status: string
}

export enum ProductStatus {
    IN_STOCK = "in_stock",
    OUT_OF_STOCK = "out_of_stock",
    PENDING = "pending",
}