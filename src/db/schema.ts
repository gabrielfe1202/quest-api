import { pgTable, text, integer, timestamp, boolean } from 'drizzle-orm/pg-core'
import { createId } from '@paralleldrive/cuid2'

export const levels = pgTable('levels', {
  id: text('id')
    .primaryKey()
    .$default(() => createId()),
  title: text('title').notNull(),
  order: integer('order').notNull(),
})

export const questions = pgTable('questions', {
  id: text('id')
    .primaryKey()
    .$default(() => createId()),
  title: text('title').notNull(),
  order: integer('order').notNull(),
  points: integer('points').notNull(),
  levelId: text('level_id')
    .references(() => levels.id)
    .notNull(),
})

export const questionsOptions = pgTable('questios_options', {
  id: text('id')
    .primaryKey()
    .$default(() => createId()),
  title: text('title').notNull(),
  order: integer('order').notNull(),
  correct: boolean('correct').notNull(),
  questionId: text('question_id')
    .references(() => questions.id)
    .notNull(),
})

export const user = pgTable('user', {
  id: text('id')
    .primaryKey()
    .$default(() => createId()),
  name: text('name').notNull(),
  email: text('email').notNull(),
  password: text('password').notNull(),
})

export const userResponses = pgTable('user_responses', {
  id: text('id')
    .primaryKey()
    .$default(() => createId()),
  questionsId: text('question_id')
    .references(() => questions.id)
    .notNull(),
  optionId: text('option_id')
    .references(() => questionsOptions.id)
    .notNull(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  points: integer('points').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})

export const userLevelCompletion = pgTable('user_level_completion', {
  id: text('id')
    .primaryKey()
    .$default(() => createId()),
  levelId: text('level_id')
    .references(() => levels.id)
    .notNull(),
  userId: text('user_id')
    .references(() => user.id)
    .notNull(),
  createdAt: timestamp('created_at', { withTimezone: true })
    .notNull()
    .defaultNow(),
})
