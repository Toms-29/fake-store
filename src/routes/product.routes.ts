import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = Router();


router.get("/products/name/:productName", getProducts)

router.get("/products/id/:productId", getProduct)

router.post("/products", authRequired, addProduct)

router.put("/products/:productId", authRequired, updateProduct)

router.delete("/products/:productId", authRequired, deleteProduct)

export default router