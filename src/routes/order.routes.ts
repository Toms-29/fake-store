import { Router } from "express"

import { deleteOrder, getOrder, getOrders, orderRestore } from "../controllers/order.controller.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { authRequired } from "../middlewares/validateToken.js"
import { createRateLimiter } from "../middlewares/rateLimit.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { OrderQuerySchema, IdParamSchema } from "../schema/index.js"
import { sanitizeQuery } from "../middlewares/sanitizeQuery.js"
import { roleVerify } from "../middlewares/roleVerify.js"
import { paginationMiddleware } from "../middlewares/pagination.js"

const router = Router()

router.get("/orders",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    createRateLimiter(15, 10, "Too many orders submitted. Try again later."),
    sanitizeQuery,
    validateSchema({ user: IdParamSchema, query: OrderQuerySchema }),
    paginationMiddleware,
    getOrders)

router.get("/orders/:orderId",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    validateSchema({ params: IdParamSchema }),
    getOrder)

router.post("/orders/:orderId",
    authRequired,
    roleVerify,
    validateSchema({ params: IdParamSchema }),
    orderRestore)

router.delete("/orders/:orderId",
    authRequired,
    roleVerify,
    validateSchema({ params: IdParamSchema }),
    deleteOrder)

export default router