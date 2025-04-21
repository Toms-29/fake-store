import { Request, Response } from "express";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { OrderType } from "../types/cart.types.js";


export const addOrUpdateCart = async (req: Request, res: Response) => {
    const { id } = req.params
    const { quantity } = req.body
    const userId = req.user.id

    const newProduct = {
        productId: id,
        quantity: quantity
    }

    try {
        const productFound = await Product.findById(id)
        if (!productFound) { res.status(404).json({ message: "Product not found" }); return }

        const subtotalPrice = productFound.price * quantity


        const orderFound = await Cart.findOne({ userId: userId }).populate("products.productId").lean() as OrderType


        if (!orderFound) {
            const newCart = new Cart({
                userId: userId,
                products: [newProduct],
                totalPrice: subtotalPrice
            })

            const cartSaved = await newCart.save()

            res.status(201).json(cartSaved)
        } else {
            const productNotRepit = orderFound.products.filter((product => product.productId._id.toString() === id))


            if (productNotRepit.length >= 1) {
                const oldPrice = productFound.price * productNotRepit[0].quantity

                const updatedProduct = await Cart.updateOne(
                    { userId: userId, "products.productId": id },
                    {
                        $set: {
                            "products.$.quantity": quantity,
                            "totalPrice": orderFound.totalPrice - oldPrice + subtotalPrice
                        }
                    }
                )

                res.status(200).json(updatedProduct); return;
            } else {
                const addToCart = await Cart.updateOne(
                    { userId: userId },
                    {
                        $push: { products: newProduct },
                        $set: { totalPrice: orderFound.totalPrice + subtotalPrice }
                    }
                )

                res.status(200).json(addToCart); return;
            }
        }

    } catch (error) {
        res.status(500).json({ message: error })
    }

}


export const deletCartItem = async (req: Request, res: Response) => {
    const { id } = req.params
    const userId = req.user.id

    const productFound = await Product.findById(id)
    if (!productFound) { res.status(404).json({ message: "Product not found" }); return; }

    const orderFound = await Cart.findOne({ userId: userId })
    if (!orderFound) { res.status(404).json({ message: "Cart not found" }); return; }

    const productInCart = orderFound.products.filter((product => product.productId.toString() === id))

    try {
        const updatedCart = await Cart.updateOne(
            { userId: userId },
            {
                $set: { totalPrice: orderFound.totalPrice - productFound.price * productInCart[0].quantity },
                $pull: { products: { productId: id } }
            },
            { new: true }
        )

        if (!updatedCart) { res.status(404).json({ message: "Cart not found" }); return; }

        res.status(200).json(updatedCart)

    } catch (error) {
        res.status(500).json({ message: error })
    }
}