import { z } from 'zod'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { adminLogin, Login } from '../services/Login'

const schema = z.object({
  email: z.string(),
  password: z.string(),
})

export const loginRoute: FastifyPluginAsyncZod = async app => {
  app.post('/Login', async request => {
    const { email, password } = schema.parse(request.body)

    console.log(request.body)

    const result = await Login({
      email,
      password,
    })

    return result
  })

  app.post('/AdminLogin', async request => {
    const { email, password } = schema.parse(request.body)

    console.log(request.body)

    const result = await adminLogin({
      email,
      password,
    })

    return result
  })
}
