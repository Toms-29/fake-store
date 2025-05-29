import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

import Product from '../models/Product.model.js';
import { AddProductSchema, ProductUpdateSchema, ResponseProductSchema } from "../schema/product.schema.js"
import { ObjectIdSchema, NameParamSchema } from '../schema/common.schema.js';

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        NameParamSchema.parse(req.params.productName)

        const { productName } = req.params;

        const productsFound = await Product.find({ productName: productName }).populate('comments', 'text userId -_id').lean()
        if (!productsFound) { res.status(404).json({ message: "Product not found" }); return }

        const parsedProducts = productsFound.map(product => {
            return ResponseProductSchema.parse({
                id: product._id.toString(),
                productName: product.productName,
                description: product.description,
                comments: product.comments,
                price: product.price,
                calification: product.calification,
                amount: product.amount,
                status: product.status,
                images: product.images
            })
        })

        res.send(parsedProducts)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.params.productId)

        const { productId } = req.params;

        const productFound = await Product.findById(productId).populate('comments', 'text userId -_id').lean()
        if (!productFound) { res.status(404).json({ message: "Product not found" }); return }

        const parsedProduct = ResponseProductSchema.parse({
            id: productFound._id.toString(),
            productName: productFound.productName,
            description: productFound.description,
            comments: productFound.comments,
            price: productFound.price,
            calification: productFound.calification,
            amount: productFound.amount,
            status: productFound.status,
            images: productFound.images
        })

        res.send(parsedProduct)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        AddProductSchema.parse(req.body)

        const { productName, description, comments, price, calification, amount } = req.body

        const newProduct = new Product(
            {
                productName,
                description,
                comments,
                price,
                calification,
                amount
            }
        )
        const productSaved = await newProduct.save()

        const parsedProduct = ResponseProductSchema.parse({
            id: productSaved._id.toString(),
            productName: productSaved.productName,
            description: productSaved.description,
            comments: productSaved.comments,
            price: productSaved.price,
            calification: productSaved.calification,
            amount: productSaved.amount,
            status: productSaved.status,
            images: productSaved.images
        })

        res.json(parsedProduct)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.params.productId)
        ProductUpdateSchema.parse(req.body)

        const { productId } = req.params
        const { productName, description, price, calification, amount } = req.body

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                productName,
                description,
                price,
                calification,
                amount
            },
            { new: true }
        )
        if (!updatedProduct) { res.status(404).json({ message: "Product not found" }); return }

        const parsedProduct = ResponseProductSchema.parse({
            id: updatedProduct._id.toString(),
            productName: updatedProduct.productName,
            description: updatedProduct.description,
            comments: updatedProduct.comments,
            price: updatedProduct.price,
            calification: updatedProduct.calification,
            amount: updatedProduct.amount,
            status: updatedProduct.status,
            images: updatedProduct.images
        })

        res.status(200).json(parsedProduct)
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        ObjectIdSchema.parse(req.params.productId)

        const { productId } = req.params

        const deletedProduct = await Product.findByIdAndDelete(productId)
        if (!deletedProduct) { res.status(404).json({ message: "Product not found" }); return }

        res.status(200).json({ message: "Product deleted" })
    } catch (error) {
        if (error instanceof ZodError) { res.status(400).json({ message: error.errors.map(e => e.message) }); return }
        next(error)
    }
}