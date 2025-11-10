import { createClient } from "redis"

const redisClient = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379"
})

redisClient.on("error", (err) => console.error("Redis Error: ", err))
redisClient.on("connect", () => console.log("Connect to redis"))

await redisClient.connect()

export default redisClient