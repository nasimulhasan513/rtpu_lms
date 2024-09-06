import { db } from '~/server/utils/db'

export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug
  const userId = event.context.auth?.userId

  if (!slug || !userId) {
    throw createError({
      statusCode: 400,
      message: 'Invalid request',
    })
  }

  const enrollment = await db.enrollment.findFirst({
    where: {
      user: { id: userId },
      course: { slug },
      status: 'completed',
    },
    include: {
      course: {
        include: {
          lessons: {
            include: {
              lesson: true,
            },
            orderBy: {
              order: 'asc',
            },
          },
          exams: {
            include: {
              exam: true,
            },
          },
        },
      },
    },
  })

  if (!enrollment) {
    throw createError({
      statusCode: 404,
      message: 'Enrollment not found or not completed',
    })
  }

  const submissions = await db.submission.findMany({
    where: {
      userId,
      exam: {
        courseExams: {
          some: {
            courseId: enrollment.courseId,
          },
        },
      },
    },
  })

  const assignmentSubmissions = await db.assignmentSubmission.findMany({
    where: {
      userId,
      assignment: {
        courseId: enrollment.courseId,
      },
    },
  })

  const totalLessons = enrollment.course.lessons.length
  const completedLessons = 0 // You'll need to implement a way to track completed lessons

  const totalExams = enrollment.course.exams.length
  const completedExams = submissions.length

  const totalAssignments = await db.assignment.count({
    where: { courseId: enrollment.courseId },
  })
  const completedAssignments = assignmentSubmissions.length

  return {
    course: {
      id: enrollment.course.id,
      name: enrollment.course.name,
      slug: enrollment.course.slug,
    },
    progress: {
      lessons: {
        total: totalLessons,
        completed: completedLessons,
        percentage: Math.round((completedLessons / totalLessons) * 100),
      },
      exams: {
        total: totalExams,
        completed: completedExams,
        percentage: Math.round((completedExams / totalExams) * 100),
      },
      assignments: {
        total: totalAssignments,
        completed: completedAssignments,
        percentage: Math.round((completedAssignments / totalAssignments) * 100),
      },
    },
    lessons: enrollment.course.lessons.map((courseLesson) => ({
      id: courseLesson.lesson.id,
      title: courseLesson.lesson.title,
      order: courseLesson.order,
    })),
    exams: enrollment.course.exams.map((courseExam) => ({
      id: courseExam.exam.id,
      title: courseExam.exam.title,
      startTime: courseExam.exam.startTime,
      endTime: courseExam.exam.endTime,
    })),
  }
})