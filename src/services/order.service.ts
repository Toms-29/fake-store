import Product from "../models/Product.model.js"
import { ProductStatus } from "../types/product.types.js"

export const verifyAmount = async (id: string, quantity: number, amount: number) => {
    try {
        if (quantity < amount) ({ message: "Amount not available" })

        const amountUpdated = await Product.findOneAndUpdate(
            { userId: id },
            { $inc: { amount: - quantity } },
            { new: true }
        ).lean()

        return amountUpdated
    } catch (error) {
        return error
    }
}

export const verifySatus = async (id: string, amount: number) => {
    if (amount === 0) {
        try {
            const statusUpdated = await Product.findOneAndUpdate(
                { userId: id },
                { $set: { status: ProductStatus.OUT_OF_STOCK } },
                { new: true }
            )
            return statusUpdated
        } catch (error) {
            return error
        }
    } else { return }
}