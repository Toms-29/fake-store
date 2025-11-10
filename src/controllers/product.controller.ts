import { Request, Response, NextFunction } from 'express'

import Product from '../models/Product.model.js'
import { ProductQuerySchema } from "../schema"
import { parseProduct } from '../utils/parse/parseProduct.js'
import { HttpError } from '../errors/HttpError.js'
import { ProductStatus } from '../types/product.types.js'
import { z } from "zod"
import { restoreProduct, softDeleteProduct } from '../services/product.service.js'
import { cacheService } from '../services/cache.service.js'


const commentsPopulateConfig = {
    path: 'comments',
    select: 'text userId -_id',
    populate: {
        path: 'userId',
        select: 'userName -_id'
    }
}

type ProductQuery = z.infer<typeof ProductQuerySchema>

export const getProducts = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const query = req.query as Partial<ProductQuery>

        const filter: any = {}

        if (query.productName) { filter.productName = { $regex: query.productName, $options: "i" } }

        if (query.minPrice || query.maxPrice) {
            filter.price = {}
            if (query.minPrice !== undefined) { filter.price.$gte = query.minPrice }
            if (query.maxPrice !== undefined) { filter.price.$lte = query.maxPrice }
        }

        if (!req.user || req.user.role !== "admin") { filter.status = ProductStatus.IN_STOCK }

        if (query.category) { filter.category = query.category }

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
        const { productId } = req.params

        const productFound = await Product.findById(productId).populate(commentsPopulateConfig).lean()
        if (!productFound) { throw new HttpError("Product not found", 404) }

        const parsedProduct = parseProduct(productFound)

        res.status(200).json(parsedProduct)
    } catch (error) {
        next(error)
    }
}

export const getTopProducts = async (_req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await Product.find().sort({ salesCount: -1 }).limit(10).lean()
        if (products.length === 0) { throw new HttpError("Products not found", 404) }

        const parsedProducts = products.map(p => parseProduct(p))

        res.status(200).json(parsedProducts)
    } catch (error) {
        next(error)
    }
}

export const addProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productName, description, category, price, amount } = req.body

        const newProduct = new Product({
            productName,
            description,
            category,
            price,
            amount
        })
        const productSaved = await newProduct.save()

        const parsedProduct = parseProduct(productSaved)

        await cacheService.invalidateNamespace("products")

        res.status(200).json(parsedProduct)
    } catch (error) {
        next(error)
    }
}

export const updateProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params

        const productFound = await Product.findById(productId)
        if (!productFound) { throw new HttpError("Product not found", 404) }

        const updateFields = req.body

        const updatedProduct = await Product.findByIdAndUpdate(productId, updateFields, { new: true })

        const parsedProduct = parseProduct(updatedProduct)

        await cacheService.invalidateNamespace("products")

        res.status(200).json(parsedProduct)
    } catch (error) {
        next(error)
    }
}

export const deleteProduct = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params

        const deletedProduct = softDeleteProduct(productId)
        if (!deletedProduct) { throw new HttpError("Product not found", 404) }

        await cacheService.invalidateNamespace("products")

        res.status(200).json({ message: "Product deleted" })
    } catch (error) {
        next(error)
    }
}

export const productRestore = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { productId } = req.params

        const restore = restoreProduct(productId)
        if (!restore) { throw new HttpError("Product not found", 404) }

        await cacheService.invalidateNamespace("products")

        res.status(200).json({ message: "Product restored" })
    } catch (error) {
        next(error)
    }
}