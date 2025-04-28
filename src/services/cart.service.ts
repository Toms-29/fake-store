import Cart from "../models/Cart.model.js";
import { CartType } from "../types/cart.types.js";


export const verifyCartExist = async (id: string) => {
    try {
        const cartFound = await Cart.findOne({ userId: id })
        return cartFound
    } catch (error) {
        console.log(error)
        return error
    }
}

export const verifyProductInCrat = (cart: CartType, id: string) => {
    const productInCart = cart.products.filter((product => product.productId._id.toString() === id))
    if (productInCart.length >= 1) {
        return productInCart[0]
    } else {
        return false
    }
}