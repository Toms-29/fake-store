import { Router } from "express"

import { getOrder, getOrders } from "../controllers/order.controller.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { authRequired } from "../middlewares/validateToken.js"
import { createRateLimiter } from "../middlewares/rateLimit.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { OrderQuerySchema, IdParamSchema } from "../schema"
import { sanitizeQuery } from "../middlewares/sanitizeQuery.js"

const router = Router()

router.get("/orders",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    createRateLimiter(15, 10, "Too many orders submitted. Try again later."),
    sanitizeQuery,
    validateSchema({ user: IdParamSchema, query: OrderQuerySchema }),
    getOrders)

router.get("/orders/:orderId",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    validateSchema({ params: IdParamSchema }),
    getOrder)

export default router