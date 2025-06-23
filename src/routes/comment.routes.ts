import { Router } from "express"
import { authRequired } from "../middlewares/validateToken.js";
import { addComment, deleteComment, getProductComments, getUserComments } from "../controllers/comment.controller.js";

const router = Router()

router.post("/comments/:productId", authRequired, addComment)

router.get("/comments/product/:id", authRequired, getProductComments)

router.get("/comments/user", authRequired, getUserComments)

router.delete("	/comments/:commentId", authRequired, deleteComment)



export default router
