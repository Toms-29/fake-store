import { Request, Response, NextFunction } from "express";
import { ZodError } from "zod";

import Cart from "../models/Cart.model.js";
import Product from "../models/Product.model.js";
import { HttpError } from "../errors/HttpError.js";
import { verifyCartExist, verifyProductExist, verifyProductInCrat } from "../services/cart.service.js";
import { CartType } from "../types/cart.types.js";
import { ProductsType, ProductType } from "../types/product.types.js";
import { ObjectIdSchema } from "../schema/common.schema.js";
import { QuantityOfProductToCartSchema, ResponseCartSchema } from "../schema/cart.schema.js";


export const getCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.user.id)
        const userId = req.user.id

        const cartFound = await Cart.findOne({ userId: userId }).populate("products.productId", "productName price").lean()
        if (!cartFound) { res.status(404).json({ message: "Cart not found" }); return; }

        const cartParsed = ResponseCartSchema.parse({
            id: cartFound._id.toString(),
            userId: cartFound.userId,
            products: cartFound.products,
            totalPrice: cartFound.totalPrice
        })

        res.status(200).json(cartParsed)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const addToCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.user.id)
        ObjectIdSchema.parse(req.params.productId)
        QuantityOfProductToCartSchema.parse(req.body.quantity)

        const userId = req.user.id
        const { productId } = req.params
        const { quantity } = req.body

        const newProduct = {
            productId: productId,
            quantity: quantity
        }

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

            const cartParsed = ResponseCartSchema.parse({
                id: cartSaved._id.toString(),
                userId: cartSaved.userId,
                products: cartSaved.products,
                totalPrice: cartSaved.totalPrice
            })

            res.status(201).json(cartParsed)
        } else {
            const productInCart = verifyProductInCrat(cartExist, productId)

            if (!productInCart) {
                const addToCart = await Cart.findOneAndUpdate(
                    { userId: userId },
                    {
                        $push: { products: newProduct },
                        $set: { totalPrice: cartExist.totalPrice + subtotalPrice }
                    },
                    { new: true })

                const cartParsed = ResponseCartSchema.parse({
                    id: addToCart?._id.toString(),
                    userId: addToCart?.userId,
                    products: addToCart?.products,
                    totalPrice: addToCart?.totalPrice
                })

                res.status(200).json(cartParsed); return;
            } else {
                throw new HttpError("Product already in cart", 409)
            }
        }
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const updateCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.user.id)
        ObjectIdSchema.parse(req.params.productId)
        QuantityOfProductToCartSchema.parse(req.body.quantity)

        const userId = req.user.id
        const { productId } = req.params
        const { quantity } = req.body

        const cartExist = await verifyCartExist(userId) as CartType

        const productFound = await verifyProductExist(productId) as ProductType

        const subtotalPrice = productFound.price * quantity

        const productInCart = verifyProductInCrat(cartExist, productId) as ProductsType

        if (productInCart) {
            const oldPrice = productFound.price * productInCart.quantity

            const updatedProduct = await Cart.findOneAndUpdate(
                { userId: userId, "products.productId": productId },
                {
                    $set: {
                        "products.$.quantity": quantity,
                        "totalPrice": cartExist.totalPrice - oldPrice + subtotalPrice
                    }
                }
            )

            const cartParsed = ResponseCartSchema.parse({
                id: updatedProduct?._id.toString(),
                userId: updatedProduct?.userId,
                products: updatedProduct?.products,
                totalPrice: updatedProduct?.totalPrice
            })

            res.status(200).json(cartParsed); return;
        } else {
            res.status(404).json({ message: "Product not found in cart" }); return;
        }
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const deletCartItem = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.user.id)
        ObjectIdSchema.parse(req.params.productId)

        const userId = req.user.id
        const { productId } = req.params

        const productFound = await Product.findById(productId)
        if (!productFound) { res.status(404).json({ message: "Product not found" }); return; }

        const cartFound = await Cart.findOne({ userId: userId })
        if (!cartFound) { res.status(404).json({ message: "Cart not found" }); return; }

        const productInCart = cartFound.products.filter((product => product.productId.toString() === productId))

        const updatedCart = await Cart.findOneAndUpdate(
            { userId: userId },
            {
                $set: { totalPrice: cartFound.totalPrice - productFound.price * productInCart[0].quantity },
                $pull: { products: { productId: productId } }
            },
            { new: true }
        )
        if (!updatedCart) { res.status(404).json({ message: "Cart not found" }); return; }

        const cartParsed = ResponseCartSchema.parse({
            id: updatedCart?._id.toString(),
            userId: updatedCart?.userId,
            products: updatedCart?.products,
            totalPrice: updatedCart?.totalPrice
        })

        res.status(200).json(cartParsed)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const deleteCart = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.params.cartId)

        const { cartId } = req.params

        const cartDeleted = await Cart.findByIdAndDelete(cartId)
        if (!cartDeleted) { res.status(404).json({ message: "Cart not found" }); return; }

        const cartParsed = ResponseCartSchema.parse({
            id: cartDeleted?._id.toString(),
            userId: cartDeleted?.userId,
            products: cartDeleted?.products,
            totalPrice: cartDeleted?.totalPrice
        })

        res.status(200).json(cartParsed) // CAMBIAR A MENSAJE DE TEXTO
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}