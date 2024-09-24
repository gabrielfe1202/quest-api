import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { listQuestions } from '../services/listQuestions'
import z from 'zod'
import { db } from '../db'
import { contents, questions } from '../db/schema'
import { eq } from 'drizzle-orm'

const schema = z.object({
  levelId: z.string(),
})

const schemaCreate = z.object({
  id: z.string().optional(),
  title: z.string(),
  type: z.string(),
  levelId: z.string(),
  prevItemId: z.string(),
  prevItemType: z.string()
})

export const questionsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/Questions/:levelId', async request => {
    const { levelId } = schema.parse(request.params)

    const result = await listQuestions(levelId)
    return result
  })

  app.post('/Question', async (request, reply) => {
    const data = schemaCreate.parse(request.body)
    const questResult = await db.insert(questions).values({ title: data.title, type: data.type, levelId: data.levelId }).returning()

    if (data.prevItemType == 'content') {
      await db.update(contents).set({ nextQuestionId: questResult[0].id }).where(eq(contents.id, data.prevItemId))
      await db.update(questions).set({ previusContetId: data.prevItemId }).where(eq(questions.id, questResult[0].id))
    } else {
      await db.update(questions).set({ nextQuestionId: questResult[0].id }).where(eq(questions.id, data.prevItemId))
      await db.update(questions).set({ previusQuestionId: data.prevItemId }).where(eq(questions.id, questResult[0].id))
    }

    return reply.status(200).send({ success: true, msg: 'created' })

  })
}
