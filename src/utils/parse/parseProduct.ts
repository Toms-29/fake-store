import { ResponseProductSchema } from "../../schema/product.schema.js"

export const parseProduct = (product: any) => {
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
}