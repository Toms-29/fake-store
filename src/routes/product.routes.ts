import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getProducts, getProduct, addProduct, updateProduct, deleteProduct } from "../controllers/product.controller.js";

const router = Router();

router.get("/product/productName/:productName", getProducts)

router.get("/product/id/:id", getProduct)

router.post("/product/add", authRequired, addProduct)

router.put("/product/update/id/:id", authRequired, updateProduct)

router.delete("/product/delete/id/:id", authRequired, deleteProduct)


export default router