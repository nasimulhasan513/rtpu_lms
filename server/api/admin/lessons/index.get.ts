
import { z } from 'zod'

const querySchema = z.object({
  page: z.string().default('1'),
  limit: z.string().default('10'),
  search: z.string().optional(),
  subjectId: z.string().optional(),
  chapterId: z.string().optional(),
})

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    const { page, limit, search, subjectId, chapterId } = querySchema.parse(query)

    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    const skip = (pageNumber - 1) * limitNumber

    const where = {
      AND: [
        search ? {
          OR: [
            { title: { contains: search, mode: 'insensitive' } },
            { content: { contains: search, mode: 'insensitive' } },
          ]
        } : {},
        subjectId ? { subjectId } : {},
        chapterId ? { chapterId } : {},
      ]
    }

    const [lessons, totalCount] = await Promise.all([
      db.lesson.findMany({
        where,
        include: {
          subject: true,
          chapter: true,
          courses: {
            include: {
              course: true
            }
          }
        },
        skip,
        take: limitNumber,
        orderBy: { createdAt: 'desc' }
      }),
      db.lesson.count({ where })
    ])

    const formattedLessons = lessons.map(lesson => ({
      ...lesson,
      courses: lesson.courses.map(cl => cl.course)
    }))

    return {
      status: 200,
      body: {
        lessons: formattedLessons,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber)
      }
    }
  } catch (error) {
    console.error("Error fetching lessons:", error)
    return {
      status: 500,
      statusMessage: "An error occurred while fetching lessons"
    }
  }
})
