import Product from "../models/Product.model.js"
import { HttpError } from "../errors/HttpError.js"
import { ProductStatus } from "../types/product.types.js"

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
            throw new HttpError("Internal server error", 500)
        }
    } else { return }
}