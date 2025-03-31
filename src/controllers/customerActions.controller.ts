import { Request, Response } from 'express';
import Product from '../models/Product.model.js';

export const getProducts = async (req: Request, res: Response) => {
    const { productName } = req.params;
    console.log(productName)

    if (!productName) { res.status(400).json({ message: "Product no found" }); return }

    const productsFound = await Product.find({ productName: productName })

    res.send(productsFound)

}

export const getProduct = async (req: Request, res: Response) => {
    const { id } = req.params;
    console.log(id)

    if (!id) { res.status(400).json({ message: "Product no found" }); return }

    const productFound = await Product.findById({ id: id })

    res.send(productFound)
}