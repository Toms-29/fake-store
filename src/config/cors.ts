import cors from "cors"
import { ENV } from "../config/env.js"

const allowedOrigins = [`http://localhost:${ENV.PORT}`]

export const corsOptions = cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"]
})