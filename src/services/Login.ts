import { and, eq } from 'drizzle-orm'
import { db } from '../db'
import { user } from '../db/schema'

type LoginRequest = {
  email: string
  password: string
}

export async function Login({ email, password }: LoginRequest) {
  const resultUser = await db
    .select()
    .from(user)
    .where(and(eq(user.email, email), eq(user.password, password)))

  console.log(resultUser)

  if (resultUser.length === 0) {
    throw new Error('Usuario ou senha invalidos!')
  }

  return resultUser
}
