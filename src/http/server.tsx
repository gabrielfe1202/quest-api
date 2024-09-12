import fastify from 'fastify'
import { levelsRoute } from '../routes/levels'
import fastifyCors from '@fastify/cors'
import { questionsRoute } from '../routes/Questions'
import { loginRoute } from '../routes/Login'
import { responsesRoute } from '../routes/Responses'
import { userInformationRoute } from '../routes/userInformation'

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
})

app.register(levelsRoute)
app.register(questionsRoute)
app.register(loginRoute)
app.register(responsesRoute)
app.register(userInformationRoute)

app
  .listen({
    port: 3000,
  })
  .then(() => {
    console.log('Server runing in http://localhost:3000')
  })
