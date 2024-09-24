import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createLevel } from '../services/createLevel'
import { listLevel } from '../services/listLevel'
import { saveUserResponse } from '../services/saveUserResponse'
import { db } from '../db'
import { questionsOptions } from '../db/schema'
import { eq } from 'drizzle-orm'

const schema = z.object({
    id: z.string(),
    title: z.string(),
    questionId: z.string(),
})

export const optionRoute: FastifyPluginAsyncZod = async app => {
    app.post('/Option', async (request, reply) => {
        console.log(request.body)
        const { id, title, questionId } = schema.parse(request.body)
        let result = null
        if (id == "0") {
            result = await db.insert(questionsOptions).values({ title: title, correct: false, points: 5, questionId: questionId, order: 2 }).returning()
        } else {
            result = await db.update(questionsOptions).set({ title: title }).where(eq(questionsOptions.id, id)).returning()
        }

        return reply.status(200).send({ msg: result })
    })
}
