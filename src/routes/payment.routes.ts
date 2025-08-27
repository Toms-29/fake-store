import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { createCheckoutSession } from "../controllers/payment.controller.js";
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { IdParamSchema } from "../schema/index.js";

const router = Router()

router.post('/create-checkout-session',
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    validateSchema({ user: IdParamSchema }),
    createCheckoutSession)

export default router