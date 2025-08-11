import Product from "../models/Product.model.js"
import { ProductStatus, ProductType, UpdateStockOptions } from "../types/product.types.js"
import { HttpError } from "../errors/HttpError.js"
import { restoreById, softDeleteById } from "../utils/softDeleteActions.js"

export const updateFileds = async ({ id, quantity, operation }: UpdateStockOptions) => {
    const product = await Product.findById(id)
    if (!product) { throw new HttpError("Product not found", 404) }

    const newAmount = operation === 'decrease'
        ? product.amount - quantity
        : product.amount + quantity


    if (product.amount < quantity) { throw new HttpError("Insufficient amount", 409) }

    const updateFields: Partial<ProductType> = {
        amount: newAmount,
        status: product.status
    }

    if (operation === "decrease" && newAmount === 0) { updateFields.status = ProductStatus.OUT_OF_STOCK }


    if (operation === 'increase' && updateFields.status === ProductStatus.OUT_OF_STOCK && newAmount > 0) { updateFields.status = ProductStatus.IN_STOCK }

    return await Product.findByIdAndUpdate(id, { $set: updateFields })
}

export const softDeleteProduct = async (id: string) => {
    return softDeleteById(Product, id)
}

export const restoreProduct = async (id: string) => {
    return restoreById(Product, id)
}