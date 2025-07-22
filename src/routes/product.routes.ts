import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";
import { createRateLimiter } from "../middlewares/rateLimit.js";

const router = Router();

router.get("/products/name/:productName", createRateLimiter(1, 60, "Too many requests. Please slow down."), getProducts)

router.get("/products/id/:productId", createRateLimiter(1, 30, "Too many search requests. Try again shortly."), getProduct)

router.post("/products", authRequired, roleVerify, addProduct)

router.put("/products/:productId", authRequired, roleVerify, updateProduct)

router.delete("/products/:productId", authRequired, roleVerify, deleteProduct)

export default router