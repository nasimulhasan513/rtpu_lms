import { z } from "zod";

const paramSchema = z.object({
  slug: z.string().nonempty(),
});

export default defineEventHandler(async (event) => {
  const userId = event.context.user?.id;
  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const { slug } = paramSchema.parse(event.context.params);

  try {
    const enrollment = await db.enrollment.findFirst({
      where: {
        userId,
        course: { slug },
        status: "active",
      },
      select: {
        courseId: true,
        course: {
          select: {
            id: true,
            name: true,
            slug: true,
            lessons: {
              select: {
                lesson: {
                  select: {
                    id: true,
                    subject: {
                      select: {
                        id: true,
                        name: true,
                      },
                    },
                    LessonProgress: {
                      where: { userId },
                      select: { completed: true },
                    },
                  },
                },
              },
              orderBy: { order: "asc" },
            },
            exams: {
              select: {
                exam: {
                  select: {
                    id: true,
                    title: true,
                    startTime: true,
                    endTime: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!enrollment) {
      throw createError({
        statusCode: 404,
        message: "Enrollment not found or not active",
      });
    }

    const [submissionCount, assignmentSubmissionCount, totalAssignments] =
      await Promise.all([
        db.submission.count({
          where: {
            userId,
            exam: { courseExams: { some: { courseId: enrollment.courseId } } },
          },
        }),
        db.assignmentSubmission.count({
          where: {
            userId,
            assignment: { courseId: enrollment.courseId },
          },
        }),
        db.assignment.count({
          where: { courseId: enrollment.courseId },
        }),
      ]);

    const lessons = enrollment.course.lessons;
    const totalLessons = lessons.length;
    const completedLessons = lessons.filter(
      (l) => l.lesson.LessonProgress[0]?.completed
    ).length;

    const subjects = lessons.reduce(
      (acc, { lesson }) => {
        const { id, name } = lesson.subject;
        if (!acc[id]) {
          acc[id] = { id, name, totalLessons: 1 };
        } else {
          acc[id].totalLessons++;
        }
        return acc;
      },
      {} as Record<string, { id: string; name: string; totalLessons: number }>
    );

    const exams = enrollment.course.exams;
    const totalExams = exams.length;

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
          completed: submissionCount,
          percentage: Math.round((submissionCount / totalExams) * 100),
        },
        assignments: {
          total: totalAssignments,
          completed: assignmentSubmissionCount,
          percentage: Math.round(
            (assignmentSubmissionCount / totalAssignments) * 100
          ),
        },
      },
      subjects: Object.values(subjects),
      exams: exams
        .map(({ exam }) => ({
          id: exam.id,
          title: exam.title,
          status:
            new Date() > new Date(exam.startTime) &&
            new Date() < new Date(exam.endTime)
              ? "ongoing"
              : new Date() > new Date(exam.endTime)
                ? "past"
                : "upcoming",
        }))
        .filter((exam) => exam.status !== "past"),
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
