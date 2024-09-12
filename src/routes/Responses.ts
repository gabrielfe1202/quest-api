import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { createLevel } from '../services/createLevel'
import { listLevel } from '../services/listLevel'
import { saveUserResponse } from '../services/saveUserResponse'

const schema = z.object({
  question: z.string(),
  option: z.string(),
  user: z.string(),
})

export const responsesRoute: FastifyPluginAsyncZod = async app => {
  app.post('/Responses', async request => {
    const { question, option, user } = schema.parse(request.body)

    const result = await saveUserResponse({
      question,
      option,
      user,
    })

    return result
  })
}
