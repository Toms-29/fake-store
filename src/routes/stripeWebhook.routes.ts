import { Router } from "express"
import bodyParser from "body-parser"

import { handleStripeWebhook } from "../controllers/stripeWebhook.controller.js"

const router = Router()

router.post("/webhook", bodyParser.raw({ type: "application/json" }), handleStripeWebhook)

export default router