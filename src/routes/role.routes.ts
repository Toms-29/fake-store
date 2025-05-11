import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { aceptRoleChange, getRequestRoleChange, getRequestsRoleChange, rejectRoleChange, requestRoleChange } from "../controllers/role.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";

const router = Router()

router.get('/role/requests/userId/:userId', authRequired, roleVerify, getRequestRoleChange)

router.get('/role/requests', authRequired, roleVerify, getRequestsRoleChange)

router.get('/role/requests/aceptRequest', authRequired, roleVerify, aceptRoleChange)

router.get('/role/requests/rejectedRequest', authRequired, roleVerify, rejectRoleChange)

router.get('/role/requests/createRequest', authRequired, roleVerify, requestRoleChange)

export default router