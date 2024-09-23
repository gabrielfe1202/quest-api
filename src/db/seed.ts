import { eq } from 'drizzle-orm'
import { client, db } from '.'
import {
  contents,
  levels,
  questions,
  questionsOptions,
  user,
  userLevelCompletion,
  userResponses,
  usersAdmin,
} from './schema'

async function seed() {
  await db.delete(contents)
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
      { title: 'Nivel 2', order: 2, iconImage: '/src/assets/island.png' },
      { title: 'Nivel 3', order: 3 },
      { title: 'Nivel 4', order: 4 },
      { title: 'Nivel 5', order: 5, iconImage: '/src/assets/island.png' },
      { title: 'Nivel 6', order: 6, active: false },
    ])
    .returning()

  const resultQuention = await db
    .insert(questions)
    .values([
      {
        title: 'Qual a capital da França?',
        levelId: resultLevel[0].id,
        type: 'singleOption',
      },
      {
        title: 'Quem escreveu a saga "O senhor dos aneis"?',
        levelId: resultLevel[0].id,
        type: 'singleOption',
      },
      {
        title: 'Quanto vale 2 + 2 ?',
        levelId: resultLevel[1].id,
        type: 'singleOption',
      },
      {
        title: 'Qual a cor do céu?',
        levelId: resultLevel[1].id,
        type: 'singleOption',
      },
      {
        title: 'Quanto vale 2 + 2 ?',
        levelId: resultLevel[2].id,
        type: 'multipeOption',
      },
      {
        title: 'Qual a cor do céu?',
        levelId: resultLevel[2].id,
        type: 'singleOption',
      },
    ])
    .returning()

  await db.insert(questionsOptions).values([
    {
      title: 'Nova York',
      order: 1,
      correct: false,
      questionId: resultQuention[0].id,
      points: 0,
    },
    {
      title: 'Paris',
      order: 2,
      correct: true,
      questionId: resultQuention[0].id,
      points: 10,
    },
    {
      title: 'Rio de janeiro',
      order: 3,
      correct: false,
      questionId: resultQuention[0].id,
      points: 0,
    },
    {
      title: 'São Paulo',
      order: 4,
      correct: false,
      questionId: resultQuention[0].id,
      points: 0,
    },
    {
      title: 'Monteiro lobato',
      order: 1,
      correct: false,
      questionId: resultQuention[1].id,
      points: 0,
    },
    {
      title: 'J. R. R. Token',
      order: 2,
      correct: true,
      questionId: resultQuention[1].id,
      points: 10,
    },
    {
      title: 'Carlos Drumom de Andrade',
      order: 3,
      correct: false,
      questionId: resultQuention[1].id,
      points: 0,
    },
    {
      title: 'Jane Austen',
      order: 4,
      correct: false,
      questionId: resultQuention[1].id,
      points: 0,
    },
    {
      title: '4',
      order: 1,
      correct: true,
      questionId: resultQuention[2].id,
      points: 10,
    },
    {
      title: '3',
      order: 2,
      correct: false,
      questionId: resultQuention[2].id,
      points: 0,
    },
    {
      title: '8',
      order: 3,
      correct: false,
      questionId: resultQuention[2].id,
      points: 0,
    },
    {
      title: '5',
      order: 4,
      correct: false,
      questionId: resultQuention[2].id,
      points: 0,
    },
    {
      title: 'Verde',
      order: 1,
      correct: false,
      questionId: resultQuention[3].id,
      points: 0,
    },
    {
      title: 'Amarelo',
      order: 2,
      correct: false,
      questionId: resultQuention[3].id,
      points: 0,
    },
    {
      title: 'Vermelho',
      order: 3,
      correct: false,
      questionId: resultQuention[3].id,
      points: 0,
    },
    {
      title: 'Azul',
      order: 4,
      correct: true,
      questionId: resultQuention[3].id,
      points: 10,
    },
    {
      title: '4',
      order: 1,
      correct: true,
      questionId: resultQuention[4].id,
      points: 10,
    },
    {
      title: '3',
      order: 2,
      correct: false,
      questionId: resultQuention[4].id,
      points: 0,
    },
    {
      title: '8',
      order: 3,
      correct: false,
      questionId: resultQuention[4].id,
      points: 0,
    },
    {
      title: '5',
      order: 4,
      correct: false,
      questionId: resultQuention[4].id,
      points: 0,
    },
    {
      title: 'Verde',
      order: 1,
      correct: false,
      questionId: resultQuention[5].id,
      points: 0,
    },
    {
      title: 'Amarelo',
      order: 2,
      correct: false,
      questionId: resultQuention[5].id,
      points: 0,
    },
    {
      title: 'Vermelho',
      order: 3,
      correct: false,
      questionId: resultQuention[5].id,
      points: 0,
    },
    {
      title: 'Azul',
      order: 4,
      correct: true,
      questionId: resultQuention[5].id,
      points: 10,
    },
  ])

  await db
    .insert(user)
    .values([
      { name: 'gabriel', email: 'gabriel@o2ew.com.br', password: '1234' },
      { name: 'teste', email: 'teste@teste.com', password: '1234' }
    ])


  await db
    .insert(usersAdmin)
    .values([
      { name: 'gabriel', email: 'gabriel@o2ew.com.br', password: '1234' },
      { name: 'teste', email: 'teste@teste.com', password: '1234' }
    ])

  const contentsResult = await db
    .insert(contents)
    .values({
      title: 'Conteudo exemplo',
      text: 'Texto do conteudo',
      nextQuestionId: resultQuention[1].id,
      previusQuestionId: resultQuention[0].id,
    })
    .returning()

  await db
    .update(questions)
    .set({ nextContetId: contentsResult[0].id })
    .where(eq(questions.id, resultQuention[0].id))

  await db
    .update(questions)
    .set({ previusContetId: contentsResult[0].id })
    .where(eq(questions.id, resultQuention[1].id))

  await db
    .update(questions)
    .set({ nextQuestionId: resultQuention[3].id })
    .where(eq(questions.id, resultQuention[2].id))


  await db
    .update(questions)
    .set({ previusQuestionId: resultQuention[2].id })
    .where(eq(questions.id, resultQuention[3].id))

  await db
    .update(questions)
    .set({ nextQuestionId: resultQuention[5].id, previusContetId: resultQuention[3].id })
    .where(eq(questions.id, resultQuention[4].id))

}

seed().finally(() => {
  client.end()
})
