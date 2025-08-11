import { Router } from "express"

import { authRequired } from "../middlewares/validateToken.js"
import { addComment, commentRestore, deleteComment, getProductComments, getUserComments, updateComment } from "../controllers/comment.controller.js"
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js"
import { createRateLimiter } from "../middlewares/rateLimit.js"
import { validateSchema } from "../middlewares/validateSchema.js"
import { IdParamSchema, TextOfCommentSchema } from "../schema"
import { sanitizeQuery } from "../middlewares/sanitizeQuery.js"

const router = Router()

router.post("/comments/:productId",
    authRequired,
    isOwnerOrAdminFactory("owner", (req) => req.user.id),
    createRateLimiter(10, 3, "Too many comments submitted. Please wait before posting again."),
    sanitizeQuery,
    validateSchema({ params: IdParamSchema, body: TextOfCommentSchema }),
    addComment)

router.get("/comments/product/:id",
    authRequired,
    validateSchema({ params: IdParamSchema }),
    getProductComments)

router.get("/comments/user",
    authRequired, isOwnerOrAdminFactory("admin"),
    validateSchema({ user: IdParamSchema }),
    getUserComments)

router.put("/comment/:commentId",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    sanitizeQuery,
    validateSchema({ params: IdParamSchema, body: TextOfCommentSchema }),
    updateComment)

router.post("/comments/restore/:commentId",
    authRequired,
    isOwnerOrAdminFactory("admin", (req) => req.user.id),
    validateSchema({ params: IdParamSchema }),
    commentRestore)

router.delete("/comments/:commentId",
    authRequired,
    isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id),
    validateSchema({ params: IdParamSchema }),
    deleteComment)

export default router
