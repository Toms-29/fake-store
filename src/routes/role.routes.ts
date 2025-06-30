import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { aceptRoleChange, getRequestRoleChange, getRequestsRoleChange, rejectRoleChange, requestRoleChange } from "../controllers/role.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";

const router = Router()

router.get('/role/user/:userId', authRequired, roleVerify, getRequestRoleChange)

router.get('/role', authRequired, roleVerify, getRequestsRoleChange)

router.put('/role/acept/:requestId', authRequired, roleVerify, aceptRoleChange)

router.put('/role/reject/:requestId', authRequired, roleVerify, rejectRoleChange)

router.post('/role', authRequired, roleVerify, requestRoleChange)

export default router