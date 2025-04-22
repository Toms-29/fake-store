import { Request, Response } from 'express';
import Product from '../models/Product.model.js';


export const getProducts = async (req: Request, res: Response) => {
    const { productName } = req.params;

    if (!productName) { res.status(400).json({ message: "Product no found" }); return }

    try {
        const productsFound = await Product.find({ productName: productName }).populate('comments', 'text userId -_id').lean()
        if (!productsFound) { res.status(404).json({ message: "Product not found" }); return }

        res.send(productsFound)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) { res.status(400).json({ message: "Product no found" }); return }

    try {
        const productFound = await Product.findById(id).populate('comments', 'text userId -_id').lean()
        if (!productFound) { res.status(404).json({ message: "Product not found" }); return }

        res.send(productFound)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const addProduct = async (req: Request, res: Response) => {

    const { productName, description, comments, price, calification, amount } = req.body

    try {
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

        res.json(
            {
                id: productSaved._id,
                productName: productSaved.productName,
                comments: productSaved.comments,
                price: productSaved.price,
                calification: productSaved.calification,
                amount: productSaved.amount
            }
        )

    } catch (error) {
        res.status(500).json({ message: error })

    }

}

export const updateProduct = async (req: Request, res: Response) => {
    const { id } = req.params
    const { productName, description, price, calification, amount } = req.body

    try {
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
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

        res.status(200).json(updatedProduct)
    } catch (error) {
        res.status(500).json({ message: error })
    }

}

export const deleteProduct = async (req: Request, res: Response) => {
    const { id } = req.params

    try {
        const deletedProduct = await Product.findByIdAndDelete(id)
        if (!deletedProduct) { res.status(404).json({ message: "Product not found" }); return }

        res.status(200).json({ message: "Product deleted" })

    } catch (error) {
        res.status(500).json({ message: error })
    }
}