import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import {
  questions,
  questionsOptions,
  userLevelCompletion,
  userResponses,
} from '../db/schema'

type userResponseRequest = {
  question: string
  option: string
  user: string
}

export async function saveUserResponse(responses: userResponseRequest) {
  const questResult = await db
    .select()
    .from(questions)
    .where(eq(questions.id, responses.question))

  const optResult = await db
    .select()
    .from(questionsOptions)
    .where(eq(questionsOptions.id, responses.option))

  await db.insert(userResponses).values({
    optionId: responses.option,
    questionsId: responses.question,
    points: optResult[0].points,
    userId: responses.user,
  })

  const CompletionsResult = await db
    .select()
    .from(userLevelCompletion)
    .where(
      and(
        eq(userLevelCompletion.levelId, questResult[0].levelId),
        eq(userLevelCompletion.userId, responses.user)
      )
    )

  if (CompletionsResult.length === 0) {
    await db.insert(userLevelCompletion).values({
      levelId: questResult[0].levelId,
      userId: responses.user,
    })
  }

  return 'salvo'
}
