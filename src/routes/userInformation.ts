import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { listQuestions } from '../services/listQuestions'
import z from 'zod'
import { db } from '../db'
import { userResponses } from '../db/schema'
import { eq } from 'drizzle-orm'

const schema = z.object({
  userId: z.string(),
})

export const userInformationRoute: FastifyPluginAsyncZod = async app => {
  app.get('/UserInfo/:userId', async request => {
    console.log(request.params)
    const { userId } = schema.parse(request.params)
    let score = 0

    const result = await db
      .select()
      .from(userResponses)
      .where(eq(userResponses.userId, userId))

    result.map(item => {
      score = score + item.points
    })

    return {
      score,
    }
  })
}
