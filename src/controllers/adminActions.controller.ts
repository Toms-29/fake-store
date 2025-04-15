import { Request, Response } from "express";
import Product from "../models/Product.model.js";

export const addProduct = async (req: Request, res: Response) => {

    const { productName, description, comment, price, calification, amount} = req.body

    try {
        const newProduct = new Product(
            {
                productName,
                description,
                comment,
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