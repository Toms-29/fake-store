import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const db = await mongoose.connect("mongodb://127.0.0.1:27017/fakeStore")
        console.log("DB is connected", db.connection.name)
    } catch (error) {
        console.log("Error to connect to DB", error)
    }
}