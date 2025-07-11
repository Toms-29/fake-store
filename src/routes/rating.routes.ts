import { Router } from "express"

import { authRequired } from "../middlewares/validateToken.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { rateProduct } from "../controllers/rating.controller.js"

const router = Router()

router.put("/rating", authRequired, isOwnerOrAdminFactory("owner", (req) => req.user.id), rateProduct)

export default router