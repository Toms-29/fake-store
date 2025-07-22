import { Router } from "express"

import { getOrder, getOrders } from "../controllers/order.controller.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { authRequired } from "../middlewares/validateToken.js"
import { createRateLimiter } from "../middlewares/rateLimit.js"

const router = Router()

router.get("/orders",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    createRateLimiter(15, 10, "Too many orders submitted. Try again later."),
    getOrders)

router.get("/orders/:id", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id), getOrder)

export default router