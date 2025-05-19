import mongoose from "mongoose";
import { ENV } from "../config/env.js";

export const connectDB = async () => {
    try {
        const db = await mongoose.connect(ENV.DB_URI)
        console.log("DB is connected", db.connection.name)
    } catch (error) {
        console.log("Error to connect to DB", error)
    }
}