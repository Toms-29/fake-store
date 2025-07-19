import { z } from "zod"
import { DeleteStatusSchema, ObjectIdSchema, PositiveFloat, PositiveInteger, TimeStampsSchema } from "./common.schema.js"
import { ProductName } from "./product.schema.js"

export const OrderStatusSchema = z.enum(["paid", "pending", "cancelled"]);

export const BaseOrderSchema = z.object({
    id: ObjectIdSchema,
    userId: ObjectIdSchema,
    email: z.string().email(),
    cartId: ObjectIdSchema,
    products: z.array(z.object({
        productId: z.object({
            id: ObjectIdSchema,
            productName: ProductName,
        }),
        quantity: PositiveInteger,
        price: PositiveFloat
    })),
    totalPrice: PositiveFloat,
    paymentId: z.string().trim(),
    status: OrderStatusSchema
}).merge(TimeStampsSchema).merge(DeleteStatusSchema).strict().required()

export const ResponseOrderSchema = BaseOrderSchema.omit({ isDeleted: true, deletedAt: true, updatedAt: true }).strict().required()

export const OrderQuerySchema = z.object({
    status: z.enum(["pending", "paid", "cancelled"]),
    sortBy: z.enum(["createdAt", "totalPrice"]),
    order: z.enum(["asc", "desc"]),
    page: z.coerce.number().min(1),
    limit: z.coerce.number().min(1).max(100)
}).partial()