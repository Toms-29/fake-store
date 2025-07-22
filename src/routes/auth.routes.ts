import { Router } from "express"

import { register, login, logout, profile, forgotPassword, resetPassword } from "../controllers/auth.controller.js"
import { authRequired } from "../middlewares/validateToken.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { createRateLimiter } from "../middlewares/rateLimit.js"

const router = Router();

router.post("/auth/register", createRateLimiter(15, 5, "Too many registration attempts. Please wait and try again."), register)

router.post("/auth/login", createRateLimiter(10, 5, "Too many login attempts. Please try again later."), login)

router.post("/auth/logout", logout)

router.post("/auth/forgot-password",
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    createRateLimiter(15, 5, "Too many password reset requests. Try again later."),
    forgotPassword)

router.post("/auth/reset-password/:token",
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    createRateLimiter(10, 5, "Too many password change attempts. Please wait."),
    resetPassword)

router.get("/auth/profile",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    createRateLimiter(15, 5, "Too many profile update attempts. Please slow down."),
    profile)

export default router