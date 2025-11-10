import { Request, Response, NextFunction } from "express"
import { cacheService } from "../services/cache.service.js"

const CACHE_CONFIG = {
    products: { ttl: 0 },
    order: { ttl: 60 },
    user: { ttl: 300 },
}

export const cacheMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (req.method !== "GET") return next()

    const namespace = req.originalUrl.split("/")[2]
    const config = CACHE_CONFIG[namespace as keyof typeof CACHE_CONFIG]
    if (!config) return next()

    const key = cacheService.generateKey(namespace, req.originalUrl)
    const cached = await cacheService.get(key)

    if (cached) { return res.json(cached) }

    const originalJson = res.json.bind(res)
    res.json = (data: any) => {
        (async () => {
            try {
                if (config.ttl === 0) await cacheService.set(key, data)
                else await cacheService.set(key, data, config.ttl)
            } catch (err) { console.error("Cache set error: ", err) }
        })()
        return originalJson(data)
    }

    next()
}