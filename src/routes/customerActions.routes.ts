import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { getProducts, getProduct } from "../controllers/customerActions.controller.js";

const router = Router();

router.get("/products/:productName", authRequired, getProducts)

router.get("/products/:id", authRequired, getProduct)


export default router