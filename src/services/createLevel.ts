import { db } from "../db"
import { levels } from "../db/schema"

type createLevelRequest = {
    title: string,
    order: number
}

export async function createLevel({ title, order }: createLevelRequest) {
    const result = await db
        .insert(levels)
        .values({ title, order })
        .returning()

    const level = result[0]

    return {
        level,
    }
}