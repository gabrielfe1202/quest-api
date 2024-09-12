import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { listQuestions } from '../services/listQuestions'
import z from 'zod'

const schema = z.object({
  levelId: z.string(),
})

export const questionsRoute: FastifyPluginAsyncZod = async app => {
  app.get('/Questions/:levelId', async request => {
    console.log(request.params)
    const { levelId } = schema.parse(request.params)

    const result = await listQuestions(levelId)
    return result
  })
}
