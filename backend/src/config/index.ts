/**
 * Application configuration loaded from environment variables.
 */
import dotenv from 'dotenv'

// Load environment variables from .env file
dotenv.config()

interface Config {
    port: number
    nodeEnv: string
    mongodbUri: string
    corsOrigin: string | string[]
}

function getEnvVariable(key: string, defaultValue?: string): string {
    const value = process.env[key] || defaultValue
    if (value === undefined) {
        throw new Error(`Missing required environment variable: ${key}`)
    }
    return value
}

export const config: Config = {
    port: parseInt(getEnvVariable('PORT', '3001'), 10),
    nodeEnv: getEnvVariable('NODE_ENV', 'development'),
    mongodbUri: getEnvVariable(
        'MONGODB_URI',
        'mongodb://localhost:27017/whiteboard'
    ),
    corsOrigin: getEnvVariable('CORS_ORIGIN', 'http://localhost:5173'),
}

export default config
