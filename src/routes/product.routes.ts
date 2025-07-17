import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";

const router = Router();

router.get("/products/name/:productName", getProducts)

router.get("/products/id/:productId", getProduct)

router.post("/products", authRequired, roleVerify, addProduct)

router.put("/products/:productId", authRequired, roleVerify, updateProduct)

router.delete("/products/:productId", authRequired, roleVerify, deleteProduct)

export default router