import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { CartType, ProductType } from "../types/cart.types.js";


export const verifyCartExist = async (id: string) => {
    try {
        const cartFound = await Cart.findOne({ userId: id })
        return cartFound
    } catch (error) {
        console.log("DB error: ", error)
        throw new Error("Internal server error")
    }
}

export const verifyProductInCrat = (cart: CartType, id: string) => {
    const productInCart = cart.products.filter((product => product.productId._id.toString() === id))
    if (productInCart.length >= 1) {
        return productInCart[0]
    } else {
        throw new Error("Product not found in cart")
    }
}

export const verifyAmount = async (id: string, quantity: number) => {
    try {
        const productFound = await Product.findById(id) as ProductType
        const productAmount = productFound?.amount

        if (productAmount === 0) { throw new Error("Product out of stock") }
        if (quantity > productAmount) { throw new Error("Not enough amount") }
    } catch (error) {
        console.log("DB error: ", error)
        throw new Error("Internal server error")
    }
}