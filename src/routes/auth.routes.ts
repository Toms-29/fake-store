import { Router } from "express";
import { register, login, logout, profile } from "../controllers/auth.controller.js"
import { authRequired } from "../middlewares/validateToken.js";
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js";

const router = Router();

router.post("/register", register)

router.post("/login", login)

router.post("/logout", logout)

router.get("/profile", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req)=> req.user.id), profile)

export default router