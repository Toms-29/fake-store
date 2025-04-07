import { Request, Response } from 'express';
import Product from '../models/Product.model.js';


export const getProducts = async (req: Request, res: Response) => {
    const { productName } = req.params;

    if (!productName) { res.status(400).json({ message: "Product no found" }); return }

    try {
        const productsFound = await Product.find({ productName: productName })

        res.send(productsFound)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;

    if (!id) { res.status(400).json({ message: "Product no found" }); return }

    try {
        const productFound = await Product.findById(id)

        res.send(productFound)
    } catch (error) {
        res.status(500).json({ message: error })
    }
}