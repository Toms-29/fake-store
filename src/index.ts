import app from "./app.js"
import { ENV } from "./config/env.js";
import { connectDB } from "./db/connectDB.js"

connectDB()

app.listen(ENV.PORT, () => { console.log(`🌎 Server running on http://localhost:${ENV.PORT}`); });