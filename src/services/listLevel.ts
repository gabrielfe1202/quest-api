import { eq } from 'drizzle-orm'
import { db } from '../db'
import { levels, userLevelCompletion } from '../db/schema'

export async function listLevel(userId: string) {
  const Levels = await db.select().from(levels)
  const Completions = await db
    .select()
    .from(userLevelCompletion)
    .where(eq(userLevelCompletion.userId, userId))
  return {
    Levels,
    Completions,
  }
}
