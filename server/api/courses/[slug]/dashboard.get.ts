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


    const cacheKey = `course-dashboard-${slug}-${userId}`;
    const cachedData = await getCache(cacheKey);

    if (cachedData) {
      return cachedData;
    }


    const course = await db.course.findFirst({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        lessons: {
          select: {
            lesson: {
              select: {
                id: true,
                is_archive: true,
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
          where: {
            exam: {
              resultPublishTime: {
                lte: new Date(),
              },
            },
          },
          select: {
            exam: {
              select: {
                id: true,
                title: true,
                totalMarks: true,
                duration: true,
                passMarks: true,
                submissions: {
                  where: { userId, status: "submitted" },
                  select: {
                    id: true,
                    marks: true,
                    correct: true,
                    wrong: true,
                    duration: true,
                    subjectBreakDown: true,
                    passed: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!course) {
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
            exam: { courseExams: { some: { courseId: course.id } } },
          },
        }),
        db.assignmentSubmission.count({
          where: {
            userId,
            assignment: { courseId: course.id },
          },
        }),
        db.assignment.count({
          where: { courseId: course.id },
        }),
      ]);

    const liveLessons = course.lessons.filter((l) => !l.lesson.is_archive);
    const totalLessons = liveLessons.length;
    const completedLessons = liveLessons.filter(
      (l) => l.lesson.LessonProgress[0]?.completed
    ).length;

    const archivedLessons = course.lessons.filter((l) => l.lesson.is_archive);
    const totalArchivedLessons = archivedLessons.length;
    const completedArchivedLessons = archivedLessons.filter(
      (l) => l.lesson.LessonProgress[0]?.completed
    ).length;

    const exams = course.exams.filter((e) => e.exam.submissions.length > 0);
    const totalExams = course.exams;
const data = {
  course: {
    id: course.id,
    name: course.name,
    slug: course.slug,
  },
  progress: {
    liveLessons: {
      total: totalLessons,
      completed: completedLessons,
      percentage: Math.round((completedLessons / totalLessons) * 100),
    },
    archivedLessons: {
      total: totalArchivedLessons,
      completed: completedArchivedLessons,
      percentage: Math.round(
        (completedArchivedLessons / totalArchivedLessons) * 100
      ),
    },
    exams: {
      total: totalExams,
      completed: exams.filter((e) => e.exam.submissions.length > 0).length,
      percentage: Math.round(
        (exams.filter((e) => e.exam.submissions.length > 0).length /
          totalExams) *
          100
      ),
      submissions: exams.map((e) => ({
        title: e.exam.title,
        totalMarks: e.exam.totalMarks,
        marks: e.exam.submissions[0]?.marks || 0,
        correct: e.exam.submissions[0]?.correct || 0,
        wrong: e.exam.submissions[0]?.wrong || 0,
        duration: e.exam.submissions[0]?.duration || 0,
        subjectBreakDown: e.exam.submissions[0]?.subjectBreakDown || [],
        passed: e.exam.submissions[0]?.passed || false,
        passMarks: e.exam.passMarks,
        totalDuration: e.exam.duration * 60 * 1000,
        percentage: e.exam.submissions[0]
          ? Math.round(
              (e.exam.submissions[0].marks / e.exam.totalMarks) * 100
            )
          : 0,
        accuracy: e.exam.submissions[0]
          ? Math.round(
              (e.exam.submissions[0].correct /
                (e.exam.submissions[0].correct +
                  e.exam.submissions[0].wrong)) *
                100
            )
          : 0,
        durationEfficiency: e.exam.submissions[0]
          ? Math.round(
              100 -
                ((e.exam.duration * 60 * 10/e.exam.submissions[0].correct)) 
            )
          : 0,
      })),
    },
    assignments: {
      total: totalAssignments,
      completed: assignmentSubmissionCount,
      percentage: Math.round(
        (assignmentSubmissionCount / totalAssignments) * 100
      ),
    },
  },
}

await setCache(cacheKey, data);
    return data;
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
