import redis from "../config/redis.js"

class CacheService {
    async get(key: string) {
        const cached = await redis.get(key)
        return cached ? JSON.parse(cached) : null
    }

    async set(key: string, data: any, ttl?: number) {
        const value = JSON.stringify(data)
        if (ttl) {
            await redis.setEx(key, ttl, value)
        } else {
            await redis.set(key, value)
        }
    }

    async invalidateNamespace(namespace: string) {
        const keys = await redis.keys(`${namespace}:*`)
        if (keys.length > 0) await redis.del(keys)
    }

    generateKey(namespace: string, identifier: string) {
        return `${namespace}:${identifier}`
    }
}

export const cacheService = new CacheService()