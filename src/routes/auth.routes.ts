import { Router } from "express"

import { register, login, logout, profile, forgotPassword, resetPassword } from "../controllers/auth.controller.js"
import { authRequired } from "../middlewares/validateToken.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { createRateLimiter } from "../middlewares/rateLimit.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { EmailSchema, IdParamSchema, PasswordSchema, LoginUserSchema, RegisterUserSchema } from "../schema/index.js"
import { sanitizeQuery } from "../middlewares/sanitizeQuery.js"

const router = Router();

router.post("/auth/register",
    createRateLimiter(15, 5, "Too many registration attempts. Please wait and try again."),
    sanitizeQuery,
    validateSchema({ body: RegisterUserSchema }),
    register)

router.post("/auth/login",
    createRateLimiter(10, 5, "Too many login attempts. Please try again later."),
    sanitizeQuery,
    validateSchema({ body: LoginUserSchema }),
    login)

router.post("/auth/logout", logout)

router.post("/auth/forgot-password",
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    createRateLimiter(15, 5, "Too many password reset requests. Try again later."),
    sanitizeQuery,
    validateSchema({ body: EmailSchema }),
    forgotPassword)

router.post("/auth/reset-password/:token",
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    createRateLimiter(10, 5, "Too many password change attempts. Please wait."),
    sanitizeQuery,
    validateSchema({ body: PasswordSchema }),
    resetPassword)

router.get("/auth/profile",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    createRateLimiter(15, 5, "Too many profile update attempts. Please slow down."),
    validateSchema({ user: IdParamSchema }),
    profile)

export default router