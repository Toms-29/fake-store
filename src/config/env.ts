import dotenv from 'dotenv'

dotenv.config()

const getEnvValue = (key: string): string => {
    const env_value = process.env[key]
    if (!env_value) { throw new Error(`Missing env var: ${key}`) }

    return env_value
}

export const ENV = {
    PORT: Number(process.env.PORT) || 4000,
    DB_URI: getEnvValue('DB_URI'),
    SECRET_TOKEN_KEY: getEnvValue('SECRET_TOKEN_KEY'),
    STRIPE_SECRET_KEY: getEnvValue('STRIPE_SECRET_KEY'),
    NODE_ENV: process.env.NODE_ENV || "development",
    STRIPE_WEBHOOK_SECRET: getEnvValue('STRIPE_WEBHOOK_SECRET'),
    STRIPE_SUCCESS_URL: getEnvValue('STRIPE_SUCCESS_URL') || "http://localhost:4000/success",
    STRIPE_CANCEL_URL: getEnvValue('STRIPE_CANCEL_URL') || "http://localhost:4000/cancel",
}