export default defineEventHandler(async (event) => {
  const exams = await db.exam.findMany({
    where: {
      courseExams: {
        some: {
          course: {
            slug: event.context.params?.slug,
          },
        },
      },
    },
    include: {
      submissions: {
        where: {
          userId: event.context.user?.id,
        },
        select: {
          id: true,
          status: true,
          marks: true,
        },
      },
      courseExams: true,
      subject: true,
    },
  });

  const currentDate = new Date();

  const examsWithStatus = exams.map((exam) => {
    let status = "";

    if (currentDate < new Date(exam.startTime)) {
      status = "upcoming";
    } else if (
      currentDate >= new Date(exam.startTime) &&
      currentDate <= new Date(exam.endTime)
    ) {
      status = "ongoing";
    } else if (currentDate > new Date(exam.startTime)) {
      status = "past";
    }

    return {
      ...exam,
      status,
      submission: exam.submissions?.[0],
    };
  });

  const ongoingExams = examsWithStatus.filter((e) => e.status === "ongoing");
  const upcomingExams = examsWithStatus.filter((e) => e.status === "upcoming");
  const pastExams = examsWithStatus.filter((e) => e.status === "past");

  return {
    statusCode: 200,
    body: {
      ongoingExams,
      upcomingExams,
      pastExams,
    },
  };
});
