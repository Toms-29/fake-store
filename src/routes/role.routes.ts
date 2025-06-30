import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { aceptRoleChange, getRequestRoleChange, getRequestsRoleChange, rejectRoleChange, requestRoleChange } from "../controllers/role.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";

const router = Router()

router.get('/role/requests/user/:userId', authRequired, roleVerify, getRequestRoleChange)

router.get('/role/requests', authRequired, roleVerify, getRequestsRoleChange)

router.put('/role/requests/acept/:requestId', authRequired, roleVerify, aceptRoleChange)

router.put('/role/requests/reject/:requestId', authRequired, roleVerify, rejectRoleChange)

router.post('/role/requests/createRequest', authRequired, roleVerify, requestRoleChange)

export default router