import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { listQuestions } from '../services/listQuestions'
import z from 'zod'
import { db } from '../db'
import { user, userResponses } from '../db/schema'
import { eq, sql } from 'drizzle-orm'

const schema = z.object({
  userId: z.string(),
})

class userPoint {
  constructor(public usuario_id:string,public total_pontos:string){}
}

export const userInformationRoute: FastifyPluginAsyncZod = async app => {
  app.get('/UserInfo/:userId', async request => {
    console.log(request.params)
    const { userId } = schema.parse(request.params)

    const resultUsers = await db.select().from(user)

    const resultados = await db
    .select({
        usuario_id: userResponses.userId,
        total_pontos: sql`SUM(points)`
    })
    .from(userResponses)
    .groupBy(userResponses.userId)

    const listPoints: userPoint[] = []

    resultados.map((item) => listPoints.push(new userPoint(item.usuario_id, item.total_pontos)))

    listPoints.sort((a,b) => parseInt(b.total_pontos) - parseInt(a.total_pontos))    

    let ranking = listPoints.findIndex(x => x.usuario_id == userId) + 1

    if(ranking == 0){
      ranking = resultUsers.length
    }

    return {
      score: parseInt(listPoints.filter(x => x.usuario_id == userId)[0].total_pontos),
      ranking
    }
  })
}
