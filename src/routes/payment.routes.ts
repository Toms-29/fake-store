import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";

const router = Router()

router.post('/create-checkout-session', authRequired, createCheckoutSession)

export default router