import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";
import { roleVerify } from "../middlewares/roleVerify.js";

const router = Router()

router.get("/users/:userId", authRequired, getUser)

router.get("/users", authRequired, roleVerify, getUsers)

router.put("/users/:userId", authRequired, updateUser)

router.delete("/users/:userId", authRequired, deleteUser)

export default router