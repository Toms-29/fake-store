import Product from "../models/Product.model.js"
import Cart from "../models/Cart.model.js"
import { HttpError } from "../errors/HttpError.js"
import { CartType } from "../types/cart.types.js"
import { ProductType } from "../types/product.types.js"
import { ProductStatus } from "../types/product.types.js"


export const confirmPurchase = async (id: string) => {
    const cartFound = await Cart.findById(id).populate('products.productId').lean() as CartType;
    if (!cartFound) { throw new HttpError("Cart not found", 404); }

    const updatedProducts = await Promise.all(cartFound.products.map(async (cartItem) => {
        const product = cartItem.productId as ProductType;
        const id = product._id.toString();
        const quantity = cartItem.quantity;
        const newAmount = product.amount - quantity;

        if (newAmount < 0) { throw new HttpError("Insufficient amount", 409); }

        const updateFields: Partial<ProductType> = {
            amount: newAmount,
        };

        if (newAmount === 0) {
            updateFields.status = ProductStatus.OUT_OF_STOCK;
        }

        return await Product.findByIdAndUpdate(
            id,
            { $set: updateFields },
            { new: true }
        );
    }));
    return updatedProducts;
};