import { Request, Response, NextFunction } from 'express';

import Product from '../models/Product.model.js';
import { AddProductSchema, ProductUpdateSchema, ProductQuerySchema } from "../schema/product.schema.js"
import { ObjectIdSchema } from '../schema/common.schema.js';
import { parseProduct } from '../utils/parse/parseProduct.js';
import { HttpError } from '../errors/HttpError.js';
import { ProductStatus } from '../types/product.types.js';


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
        const query = ProductQuerySchema.parse(req.query)

        const filter: any = {}

        if (query.productName) { filter.productName = { $regex: query.productName, $options: "i" } }

        if (query.minPrice || query.maxPrice) {
            filter.price = {}
            if (query.minPrice !== undefined) { filter.price.$gte = query.minPrice }
            if (query.maxPrice !== undefined) { filter.price.$lte = query.maxPrice }
        }

        if (req.user.role !== "admin") { filter.status = ProductStatus.IN_STOCK }

        if (query.rating) { filter.rating = query.rating }

        const sortField = query.sortBy || "createdAt"
        const sortOrder = query.order === "asc" ? 1 : -1

        const page = query.page || 1
        const limit = query.limit || 10
        const skipt = (page - 1) * limit

        const products = await Product.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skipt)
            .limit(limit)
            .populate(commentsPopulateConfig)
            .lean()
        if (products.length === 0) { throw new HttpError("Products not found", 404) }

        const parsedProducts = products.map(p => parseProduct(p))

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