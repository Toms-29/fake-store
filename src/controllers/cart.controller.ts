import { Request, Response } from "express";
import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { verifyCartExist, verifyProductInCrat } from "../services/cart.service.js";
import { CartType, ProductsType } from "../types/cart.types.js";


export const getCart = async (req: Request, res: Response) => {
    const userId = req.user.id

    try {
        const cartFound = await Cart.findOne({ userId: userId }).populate("products.productId", "productName price").lean()
        if (!cartFound) { res.status(404).json({ message: "Cart not found" }); return; }

        res.status(200).json(cartFound)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const addToCart = async (req: Request, res: Response) => {
    const { id } = req.params
    const { quantity } = req.body
    const userId = req.user.id

    const newProduct = {
        productId: id,
        quantity: quantity
    }

    try {
        const cartExist = await verifyCartExist(userId) as CartType

        const productFound = await Product.findById(id)
        if (!productFound) { res.status(404).json({ message: "Product not found" }); return }

        const subtotalPrice = productFound.price * quantity

        if (!cartExist) {
            const newCart = new Cart({
                userId: userId,
                products: [newProduct],
                totalPrice: subtotalPrice
            })

            const cartSaved = await newCart.save()

            res.status(201).json(cartSaved)
        } else {
            const productInCart = verifyProductInCrat(cartExist, id)

            if (!productInCart) {
                const addToCart = await Cart.updateOne(
                    { userId: userId },
                    {
                        $push: { products: newProduct },
                        $set: { totalPrice: cartExist.totalPrice + subtotalPrice }
                    }
                )
                res.status(200).json(addToCart); return;
            } else {
                res.status(400).json({ message: "Product already in cart" }); return;
            }
        }
    } catch (error) {
        res.status(500).json({ message: error })
    }

}

export const updateCart = async (req: Request, res: Response) => {
    const userId = req.user.id
    const { id } = req.params
    const { quantity } = req.body

    try {
        const cartExist = await verifyCartExist(userId) as CartType
        if (!cartExist) { res.status(404).json({ message: "Cart not found" }); return; }

        const productFound = await Product.findById(id)
        if (!productFound) { res.status(404).json({ message: "Product not found" }); return; }

        const subtotalPrice = productFound.price * quantity

        const productInCart = verifyProductInCrat(cartExist, id) as ProductsType

        if (productInCart) {
            const oldPrice = productFound.price * productInCart.quantity

            const updatedProduct = await Cart.updateOne(
                { userId: userId, "products.productId": id },
                {
                    $set: {
                        "products.$.quantity": quantity,
                        "totalPrice": cartExist.totalPrice - oldPrice + subtotalPrice
                    }
                }
            )
            res.status(200).json(updatedProduct); return;
        } else {
            res.status(404).json({ message: "Product not found in cart" }); return;
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

    const cartFound = await Cart.findOne({ userId: userId })
    if (!cartFound) { res.status(404).json({ message: "Cart not found" }); return; }

    const productInCart = cartFound.products.filter((product => product.productId.toString() === id))

    try {
        const updatedCart = await Cart.updateOne(
            { userId: userId },
            {
                $set: { totalPrice: cartFound.totalPrice - productFound.price * productInCart[0].quantity },
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

export const deleteCart = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const cartDeleted = await Cart.findByIdAndDelete(id)
        if (!cartDeleted) { res.status(404).json({ message: "Cart not found" }); return; }

        res.status(200).json(cartDeleted)

    } catch (error) {
        res.status(500).json({ message: error })
    }
}