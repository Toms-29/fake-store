import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import customerActionsRoutes from "./routes/customerActions.routes.js";
import adminActionsRoutes from "./routes/adminActions.routes.js"
import commentsManager from "./routes/commentsManager.routes.js"
import cartRoutes from "./routes/cart.routes.js"

const app = express();

app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser())
app.use("/api", authRoutes)
app.use("/api", customerActionsRoutes)
app.use("/admin", adminActionsRoutes)
app.use("/api", commentsManager)
app.use('/api', cartRoutes)


export default app;