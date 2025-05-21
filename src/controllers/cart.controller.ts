import { Request, Response, NextFunction } from "express";

import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { HttpError } from "../errors/HttpError.js";
import { verifyCartExist, verifyProductExist, verifyProductInCrat } from "../services/cart.service.js";
import { CartType, ProductsType, ProductType } from "../types/cart.types.js";


export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id

    try {
        const cartFound = await Cart.findOne({ userId: userId }).populate("products.productId", "productName price").lean()
        if (!cartFound) { res.status(404).json({ message: "Cart not found" }); return; }

        res.status(200).json(cartFound)
    } catch (error) {
        next(error)
    }
}

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id
    const { productId } = req.params
    const { quantity } = req.body

    const newProduct = {
        productId: productId,
        quantity: quantity
    }

    try {
        const cartExist = await verifyCartExist(userId) as CartType

        const productFound = await verifyProductExist(productId) as ProductType

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
            const productInCart = verifyProductInCrat(cartExist, productId)

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
                throw new HttpError("Product already in cart", 409)
            }
        }
    } catch (error) {
        next(error)
    }
}

export const updateCart = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id
    const { productId } = req.params
    const { quantity } = req.body

    try {
        const cartExist = await verifyCartExist(userId) as CartType

        const productFound = await verifyProductExist(productId) as ProductType

        const subtotalPrice = productFound.price * quantity

        const productInCart = verifyProductInCrat(cartExist, productId) as ProductsType

        if (productInCart) {
            const oldPrice = productFound.price * productInCart.quantity

            const updatedProduct = await Cart.updateOne(
                { userId: userId, "products.productId": productId },
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
        next(error)
    }
}

export const deletCartItem = async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.id
    const { productId } = req.params

    const productFound = await Product.findById(productId)
    if (!productFound) { res.status(404).json({ message: "Product not found" }); return; }

    const cartFound = await Cart.findOne({ userId: userId })
    if (!cartFound) { res.status(404).json({ message: "Cart not found" }); return; }

    const productInCart = cartFound.products.filter((product => product.productId.toString() === productId))

    try {
        const updatedCart = await Cart.updateOne(
            { userId: userId },
            {
                $set: { totalPrice: cartFound.totalPrice - productFound.price * productInCart[0].quantity },
                $pull: { products: { productId: productId } }
            },
            { new: true }
        )
        if (!updatedCart) { res.status(404).json({ message: "Cart not found" }); return; }

        res.status(200).json(updatedCart)
    } catch (error) {
        next(error)
    }
}

export const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
    const { cartId } = req.params

    try {
        const cartDeleted = await Cart.findByIdAndDelete(cartId)
        if (!cartDeleted) { res.status(404).json({ message: "Cart not found" }); return; }

        res.status(200).json(cartDeleted)
    } catch (error) {
        next(error)
    }
}