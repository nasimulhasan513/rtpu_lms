export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug;
  const userId = event.context.user?.id;

  if (!slug || !userId) {
    return createError({
      statusCode: 400,
      message: "Invalid request",
    });
  }

  try {
    const enrollment = await db.enrollment.findFirst({
      where: {
        user: { id: userId },
        course: { slug },
        status: "active",
      },
      include: {
        course: {
          include: {
            lessons: {
              include: {
                lesson: {
                  include: {
                    LessonProgress: {
                      where: {
                        userId,
                      },
                      select: {
                        completed: true,
                      },
                    },
                    subject: true,
                    chapter: true,
                  },
                },
              },
              orderBy: {
                order: "asc",
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
    });

    if (!enrollment) {
      throw createError({
        statusCode: 404,
        message: "Enrollment not found or not completed",
      });
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
    });

    const assignmentSubmissions = await db.assignmentSubmission.findMany({
      where: {
        userId,
        assignment: {
          courseId: enrollment.courseId,
        },
      },
    });

    const totalLessons = enrollment.course.lessons.length;
    const completedLessons = enrollment.course.lessons.filter(
      (lesson) => lesson.lesson.LessonProgress[0]?.completed
    ).length;

    const totalExams = enrollment.course.exams.length;
    const completedExams = submissions.length;

    const totalAssignments = await db.assignment.count({
      where: { courseId: enrollment.courseId },
    });
    const completedAssignments = assignmentSubmissions.length;

    let subjects: {
      id: string;
      name: string;
      totalLessons: number;
    }[] = [];

    enrollment.course.lessons.forEach((courseLesson) => {
      const subject = courseLesson.lesson.subject;
      if (!subjects.some((s) => s.id === subject.id)) {
        subjects.push({
          id: subject.id,
          name: subject.name,
          totalLessons: 1,
        });
      } else {
        const subj = subjects.find((s) => s.id === subject.id);
        subj ? subj.totalLessons++ : null;
      }
    });

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
          percentage: Math.round(
            (completedAssignments / totalAssignments) * 100
          ),
        },
      },
      subjects,
      exams: enrollment.course.exams.map((courseExam) => ({
        id: courseExam.exam.id,
        title: courseExam.exam.title,
        startTime: courseExam.exam.startTime,
        endTime: courseExam.exam.endTime,
      })),
    };
  } catch (error) {
    console.error(error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
