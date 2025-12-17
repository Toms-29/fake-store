import express from "express"
import cors from "cors"
import morgan from "morgan"
import cookieParser from "cookie-parser"

import swaggerUi from "swagger-ui-express"
import YAML from "yamljs"

import authRoutes from "./routes/auth.routes.js"
import productRoutes from "./routes/product.routes.js"
import commentRoutes from "./routes/comment.routes.js"
import cartRoutes from "./routes/cart.routes.js"
import userRoutes from "./routes/user.routes.js"
import roleRoutes from './routes/role.routes.js'
import paymentRoutes from "./routes/payment.routes.js"
import webhookRotes from "./routes/stripeWebhook.routes.js"
import orderRoutes from "./routes/order.routes.js"

import { corsOptions } from "./config/cors.js"
import { helmetOptions } from "./config/helmet.js"
import { errorHandler } from "./middlewares/errorHandler.js"
import { cacheMiddleware } from "./middlewares/cacheMiddleware.js"

const app = express();

app.use(cors(corsOptions))
app.use(helmetOptions)
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cacheMiddleware)

const swaggerDocument = YAML.load("./src/swagger.yaml")

app.use("/stripe", webhookRotes)

app.use(express.json());

app.use("/api", authRoutes)
app.use("/api", productRoutes)
app.use("/api", commentRoutes)
app.use("/api", cartRoutes)
app.use("/api", userRoutes)
app.use("/api", roleRoutes)
app.use("/api", paymentRoutes)
app.use("/api", orderRoutes)

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.use(errorHandler)

export default app;