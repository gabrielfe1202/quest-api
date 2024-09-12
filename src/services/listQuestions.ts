import { eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { questions, questionsOptions } from '../db/schema'

class option {
  constructor(
    public id: string,
    public title: string,
    public correct: boolean
  ) {}
}

class question {
  public listOptions: option[]

  constructor(
    public id: string,
    public title: string
  ) {
    this.listOptions = []
  }
}

export async function listQuestions(id: string) {
  const questionsResult = await db
    .select()
    .from(questions)
    .where(eq(questions.levelId, id))
    .orderBy(questions.order)

  const optionsResult = await db
    .select()
    .from(questionsOptions)
    .orderBy(questionsOptions.order)

  return {
    questions: questionsResult,
    options: optionsResult,
  }
}
