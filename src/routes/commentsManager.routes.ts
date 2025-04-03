import { Router } from "express"
import { authRequired } from "../middlewares/validateToken.js";
import { addComment } from "../controllers/commentsManager.controller.js";

const router = Router()

router.post("/product/id/:productId/comment", authRequired, addComment)

export default router
