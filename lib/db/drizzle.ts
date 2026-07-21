import dotenv from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

// Ensure env vars are available for CLI/seed scripts
// Load from .env.local first (Next.js dev), then fallback to .env
dotenv.config({ path: '.env.local' })
dotenv.config()

const DATABASE_URL = process.env.POSTGRES_URL || process.env.DATABASE_URL

if (!DATABASE_URL) {
  throw new Error(
    'Database URL is not set. Define POSTGRES_URL or DATABASE_URL in your .env.local or .env.'
  )
}

// Disable SSL for local development; keep flexible for Neon/Supabase in production
const isLocal =
  DATABASE_URL.includes('localhost') ||
  DATABASE_URL.includes('127.0.0.1') ||
  DATABASE_URL.includes('sslmode=disable')

export const client = postgres(DATABASE_URL, {
  ssl: isLocal ? false : { rejectUnauthorized: false },
  max: 10,
  idle_timeout: 20,
  connect_timeout: 10,
})

export const db = drizzle(client, { schema })
