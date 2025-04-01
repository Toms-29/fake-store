import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { addProduct } from "../controllers/adminActions.controller.js";

const router = Router();

router.post("/add-product", authRequired, addProduct)


export default router