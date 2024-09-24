import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { listQuestions } from '../services/listQuestions'
import z from 'zod'
import { db } from '../db'
import { contents, questions } from '../db/schema'
import { eq } from 'drizzle-orm'

const schema = z.object({
  levelId: z.string(),
})

const schemaDelete = z.object({
  id: z.string(),
})

const schemaCreate = z.object({
  id: z.string().optional(),
  title: z.string(),
  type: z.string(),
  levelId: z.string(),
})

export const questionsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/Questions/:levelId', async request => {
    const { levelId } = schema.parse(request.params)

    const result = await listQuestions(levelId)
    return result
  })

  app.delete('/Question/:id', async (request, reply) => {
    const { id } = schemaDelete.parse(request.params)

    const quest = await db.select().from(questions).where(eq(questions.id, id))

    if (quest[0].previusQuestionId !== null) {
      await db.update(questions).set({ nextQuestionId: quest[0].nextQuestionId, nextContetId: quest[0].nextContetId }).where(eq(questions.id, quest[0].previusQuestionId))
    } else if (quest[0].previusContetId !== null) {
      await db.update(contents).set({ nextQuestionId: quest[0].nextQuestionId, nextContetId: quest[0].nextContetId }).where(eq(contents.id, quest[0].previusContetId))
    }

    if (quest[0].nextQuestionId !== null) {
      await db.update(questions).set({ previusQuestionId: quest[0].previusQuestionId, previusContetId: quest[0].previusContetId }).where(eq(questions.id, quest[0].nextQuestionId))
    } else if (quest[0].nextContetId !== null) {
      await db.update(contents).set({ previusQuestionId: quest[0].previusQuestionId, previusContetId: quest[0].previusContetId }).where(eq(contents.id, quest[0].nextContetId))
    }

    await db.delete(questions).where(eq(questions.id, id))

    return reply.status(200).send({ success: true, msg: 'Deleted' })
  })

  app.post('/Question', async (request, reply) => {
    console.log(request.body)
    const data = schemaCreate.parse(request.body)
    const questResult = await db.insert(questions).values({ title: data.title, type: data.type, levelId: data.levelId }).returning()

    const prevQuest = (await db.select().from(questions).where(eq(questions.levelId, data.levelId))).find(x => x.nextContetId === null && x.nextQuestionId === null)

    if (prevQuest) {
      const updateQuest = await db.update(questions).set({ nextQuestionId: questResult[0].id }).where(eq(questions.id, prevQuest.id)).returning()
      console.log(updateQuest)
      await db.update(questions).set({ previusQuestionId: updateQuest[0].id }).where(eq(questions.id, questResult[0].id))
    }


    return reply.status(200).send({ success: true, question: questResult })

  })


  app.put('/Question', async (request, reply) => {
    const data = schemaCreate.parse(request.body)

    if (data.id) {
      const questResult = await db.update(questions).set({ title: data.title, type: data.type }).where(eq(questions.id, data.id))
      return reply.status(200).send({ success: true, question: questResult })
    }

    return reply.status(404).send({})

  })
}
