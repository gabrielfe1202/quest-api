import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createLevel } from '../services/createLevel'
import { listLevel } from '../services/listLevel'
import { db } from '../db'
import { contents, levels, questions } from '../db/schema'
import { eq } from 'drizzle-orm'

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
  id: z.string(),
  title: z.string(),
});

const mainSchema = z.object({
  title: z.string(),
  active: z.boolean(),
  items: z.array(itemSchema),
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
    const result = await db.select().from(levels)
    return result
  })


  app.get('/Level/infos/:levelId', async (request, retry) => {
    const { levelId } = schemaLevel.parse(request.params)    
    const levelResult = (await db.select().from(levels)).find(x => x.id === levelId)
    const questResult = await db.select().from(questions).where(eq(questions.levelId,levelId))
    const contsResult = await db.select().from(contents)

    return retry.status(200).send({ level: levelResult, questions: questResult, contents: contsResult })
  })

  app.put('/Level/Edit/:levelId', async (request, reply) => {
    const { levelId } = schemaLevel.parse(request.params)    
    const data = mainSchema.parse(request.body);
  })

}
