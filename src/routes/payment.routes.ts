import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js";

const router = Router()

router.post('/create-checkout-session', authRequired, isOwnerOrAdminFactory("owner", (req) => req.user.id), createCheckoutSession)

export default router