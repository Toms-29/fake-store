import { Router } from "express"
import { authRequired } from "../middlewares/validateToken.js";
import { addComment, getProductComments } from "../controllers/commentsManager.controller.js";

const router = Router()

router.post("/product/comment/id/:productId", authRequired, addComment)

router.get("/product/comments/productId/:id", authRequired, getProductComments)

// router.get("/user/id/:userId/comments", authRequired,)



export default router
