import { ResponseProductSchema } from "../../schema/index.js"

export const parseProduct = (product: any) => {
    return ResponseProductSchema.parse({
        id: product._id.toString(),
        productName: product.productName,
        description: product.description,
        comments: Array.isArray(product.comments)
            ? product.comments
                .filter((c: any) => c?.userId && c.userId.userName && c.text)
                .map((c: any) => ({
                    userName: c.userId.userName,
                    text: c.text
                }))
            : [],
        price: product.price,
        calification: product.calification,
        amount: product.amount,
        status: product.status,
        images: product.images,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt
    })
}