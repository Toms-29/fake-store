import cors from "cors"
import { ENV } from "./env.js"

const allowedOrigins = [`http://localhost:${ENV.PORT}`]

export const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) { callback(null, true) }
        else { callback(new Error("Not allowed by CORS")) }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
}