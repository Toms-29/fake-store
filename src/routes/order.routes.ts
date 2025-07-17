import { Router } from "express"

import { getOrder, getOrders } from "../controllers/order.controller.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { authRequired } from "../middlewares/validateToken.js"

const router = Router()

router.get("/orders", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id), getOrders)

router.get("/orders/:id", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id), getOrder)

export default router