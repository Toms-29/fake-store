import { Router } from "express"

import { authRequired } from "../middlewares/validateToken.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { rateProduct } from "../controllers/rating.controller.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { RateSchema, IdParamSchema } from "../schema/index.js"
import { sanitizeQuery } from "../middlewares/sanitizeQuery.js"

const router = Router()

router.put("/rating/:productId",
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    sanitizeQuery,
    validateSchema({ params: IdParamSchema, body: RateSchema, user: IdParamSchema }),
    rateProduct)

export default router