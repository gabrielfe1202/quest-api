import fastify from 'fastify'
import { levelsRoute } from '../routes/levels'
import fastifyCors from '@fastify/cors'
import { questionsRoute } from '../routes/Questions'
import { loginRoute } from '../routes/Login'
import { responsesRoute } from '../routes/Responses'
import { userInformationRoute } from '../routes/userInformation'
import { optionRoute } from '../routes/Options'

const app = fastify()

app.register(fastifyCors, {
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Métodos permitidos
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Custom-Header'],
})

app.addHook('onSend', (request, reply, payload, done) => {
  console.log(reply.getHeaders());
  done();
});

app.register(levelsRoute)
app.register(questionsRoute)
app.register(loginRoute)
app.register(responsesRoute)
app.register(userInformationRoute)
app.register(optionRoute)

app
  .listen({
    host: '0.0.0.0',
    port: 3333,
  })
  .then(() => {
    console.log('Server runing in http://localhost:3000')
  })
