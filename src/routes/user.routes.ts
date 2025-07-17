import { Router } from "express";

import { authRequired } from "../middlewares/validateToken.js";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js";

const router = Router()

router.get("/users/:userId", authRequired, roleVerify, getUser)

router.get("/users", authRequired, roleVerify, getUsers)

router.put("/users/:userId", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.params.userId), updateUser)

router.delete("/users/:userId", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.params.userId), deleteUser)

export default router