import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createLevel } from '../services/createLevel'
import { listLevel } from '../services/listLevel'

const schema = z.object({
  title: z.string(),
  order: z.number().int().min(1).max(100),
})

const schemaList = z.object({
  userId: z.string(),
})

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
}
