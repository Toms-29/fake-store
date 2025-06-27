import { Request, Response, NextFunction } from 'express';

import Product from '../models/Product.model.js';
import { AddProductSchema, ProductUpdateSchema } from "../schema/product.schema.js"
import { ObjectIdSchema, NameParamSchema } from '../schema/common.schema.js';
import { parseProduct } from '../utils/parse/parseProduct.js';
import { HttpError } from '../errors/HttpError.js';


const commentsPopulateConfig = {
    path: 'comments',
    select: 'text userId -_id',
    populate: {
        path: 'userId',
        select: 'userName -_id'
    }
}

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productName } = NameParamSchema.parse(req.params)

        const productsFound = await Product.find({ productName: { $regex: productName, $options: "i" } }).populate(commentsPopulateConfig).lean()
        if (productsFound.length === 0) { throw new HttpError("Products not found", 404) }

        const parsedProducts = productsFound.map(p => parseProduct(p))

        res.status(200).json(parsedProducts)
    } catch (error) {
        next(error)
    }
}

export const getProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = ObjectIdSchema.parse(req.params.productId)

        const productFound = await Product.findById(productId).populate(commentsPopulateConfig).lean()
        if (!productFound) { throw new HttpError("Product not found", 404) }

        const parsedProduct = parseProduct(productFound)

        res.status(200).json(parsedProduct)
    } catch (error) {
        next(error)
    }
}

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productName, description, price, amount } = AddProductSchema.parse(req.body)

        const newProduct = new Product({
            productName,
            description,
            price,
            amount
        })
        const productSaved = await newProduct.save()

        const parsedProduct = parseProduct(productSaved)

        res.status(200).json(parsedProduct)
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = ObjectIdSchema.parse(req.params.productId)

        const productFound = await Product.findById(productId)
        if (!productFound) { throw new HttpError("Product not found", 404) }

        const updateFields = ProductUpdateSchema.parse(req.body)

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true })

        const parsedProduct = parseProduct(updatedProduct)

        res.status(200).json(parsedProduct)
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const productId = ObjectIdSchema.parse(req.params.productId)

        const deletedProduct = await Product.findByIdAndDelete(productId)
        if (!deletedProduct) { throw new HttpError("Product not found", 404) }

        res.status(200).json({ message: "Product deleted" })
    } catch (error) {
        next(error)
    }
}