import { Router } from "express"
import { authRequired } from "../middlewares/validateToken.js";
import { addComment, deleteComment, getProductComments, getUserComments } from "../controllers/comment.controller.js";

const router = Router()

router.post("/product/comment/productId/:productId", authRequired, addComment)

router.get("/product/comment/productId/:productId", authRequired, getProductComments)

router.get("/product/comment", authRequired, getUserComments)

router.delete("/product/comment/id/:id", authRequired, deleteComment)



export default router
