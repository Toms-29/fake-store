import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { deleteUser, getUser, getUsers, updateUser } from "../controllers/user.controller.js";

const router = Router()

router.get("/user", authRequired, getUser)

router.get("/user/users", authRequired, getUsers)

router.put("/user/update", authRequired, updateUser)

router.delete("/user/delete", authRequired, deleteUser)

export default router