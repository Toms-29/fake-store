import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes.js";
import productRoutes from "./routes/product.routes.js";
import commentRoutes from "./routes/comment.routes.js"
import cartRoutes from "./routes/cart.routes.js"

const app = express();

app.use(morgan('dev'))
app.use(express.json());
app.use(cookieParser())
app.use("/api", authRoutes)
app.use("/api", productRoutes)
app.use("/api", commentRoutes)
app.use('/api', cartRoutes)


export default app;