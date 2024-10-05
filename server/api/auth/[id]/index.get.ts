export default defineEventHandler(async (event) => {
  const userId = event.context.params?.id;

  if (!userId) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const slug = event.context.query?.slug;

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
              select: {
                exam: {
                  select: {
                    id: true,
                    title: true,
                    totalMarks: true,
                    duration: true,
                    submissions: {
                      where: { userId, status: "submitted" },
                      select: {
                        id: true,
                        marks: true,
                        correct: true,
                        wrong: true,
                        duration: true,
                      },
                    },
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

    const liveLessons = enrollment.course.lessons.filter(
      (l) => !l.lesson.is_archive
    );
    const totalLessons = liveLessons.length;
    const completedLessons = liveLessons.filter(
      (l) => l.lesson.LessonProgress[0]?.completed
    ).length;

    const archivedLessons = enrollment.course.lessons.filter(
      (l) => l.lesson.is_archive
    );
    const totalArchivedLessons = archivedLessons.length;
    const completedArchivedLessons = archivedLessons.filter(
      (l) => l.lesson.LessonProgress[0]?.completed
    ).length;

    const exams = enrollment.course.exams.filter(
      (e) => e.exam.submissions.length > 0
    );
    const totalExams = enrollment.course.exams;

    return {
      course: {
        id: enrollment.course.id,
        name: enrollment.course.name,
        slug: enrollment.course.slug,
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
                  ((e.exam.duration * 60 * 1000 -
                    e.exam.submissions[0].duration) /
                    (e.exam.duration * 60 * 1000)) *
                    100
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
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
