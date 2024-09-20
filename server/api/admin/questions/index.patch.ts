import { z } from 'zod'
import { db } from '~/server/utils/auth'

const updateQuestionSchema = z.array(z.object({
  id: z.string(),
  serial: z.number().int().positive(),
}))

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const questions = updateQuestionSchema.parse(body)

  try {
    const updatedQuestions = await db.$transaction(
      questions.map(({ id, serial }) =>
        db.question.update({
          where: { id },
          data: { serial },
        })
      )
    )

    return updatedQuestions
  } catch (error) {
    console.error('Error updating question serials:', error)
    throw createError({
      statusCode: 500,
      message: 'Failed to update question serials',
    })
  }
})
