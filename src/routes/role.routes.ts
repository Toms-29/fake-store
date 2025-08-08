import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { aceptRoleChange, getRequestRoleChange, getRequestsRoleChange, rejectRoleChange, requestRoleChange } from "../controllers/role.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js";
import { validateSchema } from "../middlewares/validateSchema.js";
import { IdParamSchema, RequestRoleChangeSchema } from "../schema";
import { sanitizeQuery } from "../middlewares/sanitizeQuery.js";

const router = Router()

router.get('/role/user/:userId',
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.params.userId),
    validateSchema({ params: IdParamSchema }),
    getRequestRoleChange)

router.get('/role',
    authRequired,
    roleVerify,
    getRequestsRoleChange)

router.put('/role/acept/:requestId',
    authRequired,
    roleVerify,
    validateSchema({ params: IdParamSchema }),
    aceptRoleChange)

router.put('/role/reject/:requestId',
    authRequired,
    roleVerify,
    validateSchema({ params: IdParamSchema }),
    rejectRoleChange)

router.post('/role',
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    sanitizeQuery,
    validateSchema({ body: RequestRoleChangeSchema, user: IdParamSchema }),
    requestRoleChange)

export default router