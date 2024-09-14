import { eq, sql } from 'drizzle-orm'
import { db } from '../db'
import { contents, questions, questionsOptions } from '../db/schema'

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

  const optionsResult = await db
    .select()
    .from(questionsOptions)
    .orderBy(questionsOptions.order)

  const contentsResult = await db.select().from(contents)

  return {
    questions: questionsResult,
    options: optionsResult,
    contents: contentsResult
  }
}
