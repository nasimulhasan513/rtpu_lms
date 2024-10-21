import { Exam } from "@prisma/client";
const examsWithSubmissionsCount = async (exams: Exam[]) => {
  const examsWithSubmissions = await Promise.all(
    exams.map(async (exam) => {
      const submissions = await db.submission.aggregate({
        where: {
          examId: exam.id,
          status: "submitted",
        },
        _count: {
          id: true,
        },
      });

      return {
        ...exam,
        submissionsCount: submissions._count.id,
      };
    })
  );

  return examsWithSubmissions;
};
export default defineEventHandler(async (event) => {
  try {
    await validateRequest(event, ["ADMIN", "contributor"]);
    const { courseId, subjectId } = getQuery(event);

    const filters = {};

    if (courseId) {
      filters.courseExams = {
        some: {
          courseId: courseId,
        },
      };
    }

    if (subjectId && subjectId !== "all") {
      filters.subjectId = subjectId;
    }

    if (event.context.user?.role === "contributor") {
      const courses = await db.contributor.findMany({
        where: {
          userId: event.context.user?.id as string,
        },
      });

      const courseIds = courses.map((course) => course.courseId);

      const exams = await db.exam.findMany({
        where: {
          courseExams: {
            some: {
              courseId: {
                in: courseIds,
              },
            },
          },
        },

        include: {
          courseExams: {
            include: {
              course: {
                select: {
                  name: true,
                },
              },
            },
          },
          subject: {
            select: {
              name: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      const examsWithSubmissions = await examsWithSubmissionsCount(exams);

      return {
        statusCode: 200,
        body: examsWithSubmissions,
      };
    }

    const exams = await db.exam.findMany({
      where: filters,
      include: {
        courseExams: {
          include: {
            course: {
              select: {
                name: true,
              },
            },
          },
        },
        subject: {
          select: {
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    const examsWithSubmissions = await examsWithSubmissionsCount(exams);

    return {
      statusCode: 200,
      body: examsWithSubmissions,
    };
  } catch (error) {
    console.error("Error fetching exams:", error);
    return createError({
      statusCode: 500,
      message: "Failed to fetch exams",
    });
  }
});
