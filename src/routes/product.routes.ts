import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = Router();

router.get("/product/productName/:productName", getProducts)

router.get("/product/id/:productId", getProduct)

router.post("/product/add", authRequired, addProduct)

router.put("/product/update/id/:productId", authRequired, updateProduct)

router.delete("/product/delete/id/:productId", authRequired, deleteProduct)


export default router