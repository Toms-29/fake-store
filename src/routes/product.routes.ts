import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getProducts, getProduct, addProduct } from "../controllers/product.controller.js";

const router = Router();

router.get("/product/productName/:productName", getProducts)

router.get("/product/id/:id", getProduct)

router.post("/product/add", authRequired, addProduct)


export default router