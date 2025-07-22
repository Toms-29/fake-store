import helmet from "helmet"

export const helmetOptions = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            imgSrc: ["'self'", "data:", "https:"],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            objectSrc: ["'none'"],
        },
    },
    crossOriginEmbedderPolicy: false,
})