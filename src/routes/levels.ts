import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createLevel } from '../services/createLevel'
import { listLevel } from '../services/listLevel'
import { db } from '../db'
import { contents, levels, questions, questionsOptions } from '../db/schema'
import { eq } from 'drizzle-orm'
import { Option, Question } from '../models/QuestionResponse'

const schema = z.object({
  title: z.string(),
  order: z.number().int().min(1).max(100),
})

const schemaList = z.object({
  userId: z.string(),
})

const schemaLevel = z.object({
  levelId: z.string(),
})

const schemaQuest = z.object({
  id: z.string(), // Exemplo de propriedade
  title: z.string(),
});

const itemSchema = z.object({
  type: z.string(),
  quest: z.object({
    id: z.string(),
    nextQuestionId: z.string().nullable(),
    nextContetId: z.string().nullable(),
    previusQuestionId: z.string().nullable(),
    previusContetId: z.string().nullable(),
  }).optional(),
  content: z.object({
    id: z.string(),
    nextQuestionId: z.string().nullable(),
    nextContetId: z.string().nullable(),
    previusQuestionId: z.string().nullable(),
    previusContetId: z.string().nullable(),
  }).optional(),
});

const mainSchema = z.object({
  title: z.string(),
  active: z.boolean(),
  questions: z.array(itemSchema),
});

const arraySchema = z.array(schemaQuest);


export const levelsRoute: FastifyPluginAsyncZod = async app => {
  app.post('/Level', async request => {
    const { title, order } = schema.parse(request.body)

    const result = await createLevel({
      title,
      order,
    })

    return result
  })

  app.get('/Level/:userId', async request => {
    const { userId } = schemaList.parse(request.params)

    const result = await listLevel(userId)
    return result
  })


  app.get('/LevelList', async () => {
    const result = await db.select().from(levels).orderBy(levels.order)
    return result
  })


  app.get('/Level/infos/:levelId', async (request, retry) => {
    const { levelId } = schemaLevel.parse(request.params)
    const levelResult = (await db.select().from(levels)).find(x => x.id === levelId)
    const questResult = await db.select().from(questions).where(eq(questions.levelId, levelId))
    const optionsResult = await db.select().from(questionsOptions).orderBy(questionsOptions.order)
    const contsResult = await db.select().from(contents)

    const questResponse: Question[] = []

    await questResult.map(async (item: any) => {
      const opts: Option[] = []      
      optionsResult.filter(x => x.questionId === item.id).map((item2) => {
        opts.push(new Option(item2))
      })
      const newQuest = new Question(item)
      newQuest.options = opts
      questResponse.push(newQuest)
    })

    return retry.status(200).send({ level: levelResult, questions: questResponse, contents: contsResult })
  })

  app.put('/Level/Edit/:levelId', async (request, reply) => {
    const { levelId } = schemaLevel.parse(request.params)
    const data = mainSchema.parse(request.body);

    try {

      const updatedLevel = await db.update(levels).set({ title: data.title, active: data.active }).where(eq(levels.id, levelId)).returning()

      if (updatedLevel.length === 0) {
        return reply.status(404).send({ msg: 'Level not found' })
      }

      data.questions.map(async (item) => {
        if (item.quest != null && item.quest !== undefined) {
          await db.update(questions).set({
            nextContetId: item.quest.nextContetId,
            nextQuestionId: item.quest.nextQuestionId,
            previusContetId: item.quest.previusContetId,
            previusQuestionId: item.quest.previusQuestionId
          }).where(eq(questions.id, item.quest.id))
        } else if (item.content !== null && item.content !== undefined) {
          await db.update(contents).set({
            nextContetId: item.content.nextContetId,
            nextQuestionId: item.content.nextQuestionId,
            previusContetId: item.content.previusContetId,
            previusQuestionId: item.content.previusQuestionId
          }).where(eq(contents.id, item.content.id))
        }
      })

      return reply.status(200).send(updatedLevel[0]);

    } catch (error) {
      console.error(error);
      return reply.status(500).send({ message: 'Error when updating level' });
    }

  })

}
