import { Router } from "express"
import { authRequired } from "../middlewares/validateToken.js";
import { addComment, deleteComment, getProductComments, getUserComments } from "../controllers/comment.controller.js";
import { isOwnerOrAdminFactory } from "../middlewares/adminOrOwner.js";

const router = Router()

router.post("/comments/:productId", authRequired, isOwnerOrAdminFactory("owner", (req) => req.user.id), addComment)

router.get("/comments/product/:id", authRequired, getProductComments)

router.get("/comments/user", authRequired, isOwnerOrAdminFactory("admin"), getUserComments)

router.delete("/comments/:commentId", authRequired, isOwnerOrAdminFactory("ownerOrAdmin", (req) => req.user.id), deleteComment)



export default router
