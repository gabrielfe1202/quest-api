import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export const client = postgres("postgresql://questionary-db_owner:RnCOQ47TEVUA@ep-shrill-surf-a54mx9e7.us-east-2.aws.neon.tech/questionary-db?sslmode=require")
export const db = drizzle(client, { schema, logger: true })
