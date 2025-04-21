import { Router } from "express"
import { authRequired } from "../middlewares/validateToken.js";
import { addComment, deleteComment, getProductComments, getUserComments } from "../controllers/comment.controller.js";

const router = Router()

router.post("/product/comment/id/:productId", authRequired, addComment)

router.get("/product/comment/productId/:id", authRequired, getProductComments)

router.get("/product/comment/userId/:id", authRequired, getUserComments)

router.delete("/product/comment/id/:id", authRequired, deleteComment)



export default router
