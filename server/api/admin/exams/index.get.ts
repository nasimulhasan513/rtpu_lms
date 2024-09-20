export default defineEventHandler(async (event) => {
  try {

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
      });

      return {
        statusCode: 200,
        body: exams,
      };
    }

    const exams = await db.exam.findMany({
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
    });

    return {
      statusCode: 200,
      body: exams,
    };
  } catch (error) {
    console.error("Error fetching exams:", error);
    return createError({
      statusCode: 500,
      message: "Failed to fetch exams",
    });
  }
});
