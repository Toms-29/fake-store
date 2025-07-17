import { Router } from "express";

import { register, login, logout, profile, forgotPassword, resetPassword } from "../controllers/auth.controller.js"
import { authRequired } from "../middlewares/validateToken.js";
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js";
import { loginLimiter } from "../middlewares/rateLimit.js";

const router = Router();

router.post("/auth/register", register)

router.post("/auth/login", loginLimiter, login)

router.post("/auth/logout", logout)

router.post("/auth/forgot-password", authRequired, isOwnerOrAdminFactory("owner", (req) => req.user.id), forgotPassword)

router.post("/auth/reset-password/:token", authRequired, isOwnerOrAdminFactory("owner", (req) => req.user.id), resetPassword)

router.get("/auth/profile", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id), profile)

export default router