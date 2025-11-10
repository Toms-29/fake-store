import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct, productRestore, getTopProducts } from "../controllers/product.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";
import { createRateLimiter } from "../middlewares/rateLimit.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { IdParamSchema, AddProductSchema, ProductQuerySchema, ProductUpdateSchema } from "../schema/index.js";
import { sanitizeQuery } from "../middlewares/sanitizeQuery.js";

const router = Router();

router.get("/products",
    createRateLimiter(1, 60, "Too many requests. Please slow down."),
    sanitizeQuery,
    validateSchema({ query: ProductQuerySchema }),
    getProducts)

router.get("/products/id/:productId",
    createRateLimiter(1, 30, "Too many search requests. Try again shortly."),
    validateSchema({ params: IdParamSchema }),
    getProduct)

router.get("/products/top",
    sanitizeQuery,
    createRateLimiter(1, 60, "Too many requests. Please slow down."),
    getTopProducts)

router.post("/products",
    authRequired,
    roleVerify,
    sanitizeQuery,
    validateSchema({ body: AddProductSchema }),
    addProduct)

router.put("/products/:productId",
    authRequired,
    roleVerify,
    sanitizeQuery,
    validateSchema({ params: IdParamSchema, body: ProductUpdateSchema }),
    updateProduct)

router.post("/products/:productId",
    authRequired,
    roleVerify,
    validateSchema({ params: IdParamSchema }),
    productRestore)

router.delete("/products/:productId",
    authRequired,
    roleVerify,
    validateSchema({ params: IdParamSchema }),
    deleteProduct)

export default router