import { Router } from "express"

import { authRequired } from "../middlewares/validateToken.js"
import { addComment, deleteComment, getProductComments, getUserComments, updateComment } from "../controllers/comment.controller.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { createRateLimiter } from "../middlewares/rateLimit.js"

const router = Router()

router.post("/comments/:productId",
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    createRateLimiter(10, 3, "Too many comments submitted. Please wait before posting again."),
    addComment)

router.get("/comments/product/:id", authRequired, getProductComments)

router.get("/comments/user", authRequired, isOwnerOrAdminFactory("admin"), getUserComments)

router.put("/comment/:commentId", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id), updateComment)

router.delete("/comments/:commentId", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id), deleteComment)



export default router
