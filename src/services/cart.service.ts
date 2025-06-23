import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { HttpError } from "../errors/HttpError.js";
import { CartType } from "../types/cart.types.js";
import { ProductType } from "../types/product.types.js";


export const verifyCartExist = async (id: string) => {
    try {
        const cartFound = await Cart.findOne({ userId: id })
        if (!cartFound) { throw new HttpError("Cart not found", 404) }
        return cartFound
    } catch (error) {
        console.error("DB error: ", error)
        throw new HttpError("Internal server error", 500)
    }
}

export const verifyProductExist = async (id: string) => {
    try {
        const productFound = await Product.findById(id)
        if (!productFound) { throw new HttpError("Product not found", 404) }
        return productFound
    } catch (error) {
        console.error("Db error:", error)
        throw new HttpError("Internal server error", 500)
    }
}

export const verifyProductInCart = (cart: CartType, id: string) => {
    return cart.products.find(p => p.productId.toString() === id) || null;
}

export const verifyAmount = async (id: string, quantity: number) => {
    try {
        const productFound = await Product.findById(id) as ProductType
        const productAmount = productFound?.amount

        if (productAmount === 0) { throw new HttpError("Product out of stock", 409) }
        if (quantity > productAmount) { throw new HttpError("Not enough amount", 409) }
    } catch (error) {
        console.error("DB error: ", error)
        throw new HttpError("Internal server error", 500)
    }
}