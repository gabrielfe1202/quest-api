import { client, db } from '.'
import {
  levels,
  questions,
  questionsOptions,
  user,
  userLevelCompletion,
  userResponses,
} from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(userResponses)
  await db.delete(userLevelCompletion)
  await db.delete(questionsOptions)
  await db.delete(questions)
  await db.delete(levels)
  await db.delete(user)

  const resultLevel = await db
    .insert(levels)
    .values([
      { title: 'Nivel 1', order: 1 },
      { title: 'Nivel 2', order: 2 },
      { title: 'Nivel 3', order: 3 },
    ])
    .returning()

  const resultQuention = await db
    .insert(questions)
    .values([
      {
        title: 'Qual a capital da França?',
        order: 1,
        levelId: resultLevel[0].id,
        points: 10,
      },
      {
        title: 'Quem escreveu a saga "O senhor dos aneis"?',
        order: 2,
        levelId: resultLevel[0].id,
        points: 5,
      },
      {
        title: 'Quanto vale 2 + 2 ?',
        order: 1,
        levelId: resultLevel[1].id,
        points: 5,
      },
      {
        title: 'Qual a cor do céu?',
        order: 2,
        levelId: resultLevel[1].id,
        points: 20,
      },
      {
        title: 'Quanto vale 2 + 2 ?',
        order: 1,
        levelId: resultLevel[2].id,
        points: 5,
      },
      {
        title: 'Qual a cor do céu?',
        order: 2,
        levelId: resultLevel[2].id,
        points: 20,
      },
    ])
    .returning()

  await db.insert(questionsOptions).values([
    {
      title: 'Nova York',
      order: 1,
      correct: false,
      questionId: resultQuention[0].id,
    },
    {
      title: 'Paris',
      order: 2,
      correct: true,
      questionId: resultQuention[0].id,
    },
    {
      title: 'Rio de janeiro',
      order: 3,
      correct: false,
      questionId: resultQuention[0].id,
    },
    {
      title: 'São Paulo',
      order: 4,
      correct: false,
      questionId: resultQuention[0].id,
    },
    {
      title: 'Monteiro lobato',
      order: 1,
      correct: false,
      questionId: resultQuention[1].id,
    },
    {
      title: 'J. R. R. Token',
      order: 2,
      correct: true,
      questionId: resultQuention[1].id,
    },
    {
      title: 'Carlos Drumom de Andrade',
      order: 3,
      correct: false,
      questionId: resultQuention[1].id,
    },
    {
      title: 'Jane Austen',
      order: 4,
      correct: false,
      questionId: resultQuention[1].id,
    },
    {
      title: '4',
      order: 1,
      correct: true,
      questionId: resultQuention[2].id,
    },
    {
      title: '3',
      order: 2,
      correct: false,
      questionId: resultQuention[2].id,
    },
    {
      title: '8',
      order: 3,
      correct: false,
      questionId: resultQuention[2].id,
    },
    {
      title: '5',
      order: 4,
      correct: false,
      questionId: resultQuention[2].id,
    },
    {
      title: 'Verde',
      order: 1,
      correct: false,
      questionId: resultQuention[3].id,
    },
    {
      title: 'Amarelo',
      order: 2,
      correct: false,
      questionId: resultQuention[3].id,
    },
    {
      title: 'Vermelho',
      order: 3,
      correct: false,
      questionId: resultQuention[3].id,
    },
    {
      title: 'Azul',
      order: 4,
      correct: true,
      questionId: resultQuention[3].id,
    },
  ])

  await db
    .insert(user)
    .values({ name: 'gabriel', email: 'gabriel@o2ew.com.br', password: '1234' })
}

seed().finally(() => {
  client.end()
})
