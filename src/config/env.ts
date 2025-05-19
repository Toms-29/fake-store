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
    SECRET_TOKEN_KEY: getEnvValue('SECRET_TOKEN_KEY')
}