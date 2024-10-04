import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../db'
import { user, userResponses, usersAdmin } from '../db/schema'
import { eq, sql } from 'drizzle-orm'

const schema = z.object({
  userId: z.string(),
})

class userPoint {
  constructor(
    public usuario_id: string,
    public total_pontos: unknown | string
  ) { }
}

export const userInformationRoute: FastifyPluginAsyncZod = async app => {
  app.get('/UserInfo/:userId', async request => {
    console.log(request.params)
    const { userId } = schema.parse(request.params)

    const resultUsers = await db.select().from(user)
    console.log('aa', resultUsers)

    const resultados = await db
      .select({
        usuario_id: userResponses.userId,
        total_pontos: sql`SUM(points)`,
      })
      .from(userResponses)
      .groupBy(userResponses.userId)

    const listPoints: userPoint[] = []

    resultados.map(item =>
      listPoints.push(new userPoint(item.usuario_id, item.total_pontos))
    )

    listPoints.sort(
      (a, b) =>
        (typeof b.total_pontos === 'string'
          ? Number.parseInt(b.total_pontos)
          : 0) -
        (typeof a.total_pontos === 'string'
          ? Number.parseInt(a.total_pontos)
          : 0)
    )

    let ranking = listPoints.findIndex(x => x.usuario_id === userId) + 1

    if (ranking === 0) {
      ranking = resultUsers.length
    }

    const score =
      listPoints.filter(x => x.usuario_id === userId).length > 0
        ? listPoints.filter(x => x.usuario_id === userId)[0].total_pontos
        : '0'

    const userName = resultUsers.find(x => x.id === userId)?.name
    const userEmail = resultUsers.find(x => x.id === userId)?.email

    return {
      score: typeof score === 'string' ? Number.parseInt(score) : 0,
      ranking,
      userInfos: {
        userName,
        userEmail,
      },
    }
  })

  app.get('/AdminInfo/:userId', async (request, reply) => {
    const { userId } = schema.parse(request.params)

    const user = (await db.select().from(usersAdmin)).find(x => x.id === userId)

    return user
  })
}
