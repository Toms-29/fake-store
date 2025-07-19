import { Request, Response, NextFunction } from "express";

import Cart from "../models/Cart.model.js";
import { HttpError } from "../errors/HttpError.js";
import { verifyAmount, verifyCartExist, verifyProductExist, verifyProductInCart } from "../services/cart.service.js";
import { CartType } from "../types/cart.types.js";
import { ProductsType } from "../types/product.types.js";
import { ObjectIdSchema, CartItemInputSchema } from "../schema";
import { parseCart } from "../utils/parse/parseCart.js";


export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.user.id)

        const cartFound = await Cart.findOne({ userId: userId }).populate("products.productId", "productName price").lean()
        if (!cartFound) { throw new HttpError("Cart not found", 404) }

        const cartParsed = parseCart(cartFound)
        res.status(200).json(cartParsed)
    } catch (error) {
        next(error)
    }
}

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, productId, quantity } = CartItemInputSchema.parse({
            userId: req.user.id,
            productId: req.params.productId,
            quantity: req.body.quantity
        })

        const newProduct = { productId, quantity }

        const cartFound = await Cart.findOne({ userId: userId }).lean() as CartType
        const productFound = await verifyProductExist(productId)

        await verifyAmount(productId, quantity)

        const subtotalPrice = productFound.price * quantity

        if (!cartFound) {
            const newCart = new Cart({
                userId: userId,
                products: [newProduct],
                totalPrice: subtotalPrice
            })
            const cartSaved = await newCart.save()

            const cartParsed = parseCart(cartSaved)
            res.status(201).json(cartParsed); return;
        }

        const productInCart = verifyProductInCart(cartFound, productId)
        if (productInCart) { throw new HttpError("Product already in cart", 409) }

        const addToCart = await Cart.findOneAndUpdate(
            { userId: userId },
            {
                $push: { products: newProduct },
                $set: { totalPrice: cartFound.totalPrice + subtotalPrice }
            },
            { new: true })

        const cartParsed = parseCart(addToCart)
        res.status(200).json(cartParsed)
    } catch (error) {
        next(error)
    }
}

export const updateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { userId, productId, quantity } = CartItemInputSchema.parse({
            userId: req.user.id,
            productId: req.params.productId,
            quantity: req.body.quantity
        })

        const cart = await verifyCartExist(userId) as CartType
        const product = await verifyProductExist(productId)

        await verifyAmount(productId, quantity)

        const subtotalPrice = product.price * quantity

        const productInCart = verifyProductInCart(cart, productId) as ProductsType
        if (!productInCart) { throw new HttpError("Product not found in cart", 404) }

        const oldPrice = product.price * productInCart.quantity

        const updatedCart = await Cart.findOneAndUpdate(
            { userId: userId, "products.productId": productId },
            {
                $set: {
                    "products.$.quantity": quantity,
                    "totalPrice": cart.totalPrice - oldPrice + subtotalPrice
                }
            })
        if (!updatedCart) { throw new HttpError("Cart not found", 404) }

        const cartParsed = parseCart(updatedCart)
        res.status(200).json(cartParsed)
    } catch (error) {
        next(error)
    }
}

export const deleteCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.user.id)
        const productId = ObjectIdSchema.parse(req.params.productId)

        const productFound = await verifyProductExist(productId)

        const cartFound = await Cart.findOne({ userId: userId }).lean() as CartType
        if (!cartFound) { throw new HttpError("Cart not found", 404) }

        const productInCart = verifyProductInCart(cartFound, productId)
        if (!productInCart) { throw new HttpError("Product not found in cart", 404) }

        const updatedCart = await Cart.findOneAndUpdate(
            { userId: userId },
            {
                $set: { totalPrice: cartFound.totalPrice - productFound.price * productInCart.quantity },
                $pull: { products: { productId: productId } }
            },
            { new: true }
        )
        if (!updatedCart) { throw new HttpError("Cart not found", 404) }

        res.status(200).json({ message: "Product removed from cart successfully" })
    } catch (error) {
        next(error)
    }
}

export const clearCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = ObjectIdSchema.parse(req.user.id)

        const cart = await Cart.findOne({ userId })
        if (!cart) { throw new HttpError("Cart not found", 404) }
        if (cart.products.length === 0) { res.status(200).json({ message: "Cart was already empty" }); return }

        cart.products = []
        cart.totalPrice = 0
        await cart.save()

        res.status(200).json({ data: cart, message: "Cart cleared successfully" })
    } catch (error) {
        next(error)
    }
}

export const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cartId = ObjectIdSchema.parse(req.params.cartId)

        const cartDeleted = await Cart.findByIdAndDelete(cartId)
        if (!cartDeleted) { throw new HttpError("Cart not found", 404) }

        res.status(200).json({ message: "Cart deleted successfully" })
    } catch (error) {
        next(error)
    }
}