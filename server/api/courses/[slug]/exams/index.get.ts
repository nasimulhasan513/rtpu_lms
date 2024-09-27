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

  const examsWithStatus = await Promise.all(
    exams.map(async (exam) => {
      let status = "";
      let resultPublished = false;
      let avgMarks = 0;

      if (currentDate < new Date(exam.startTime)) {
        status = "upcoming";
      } else if (
        currentDate >= new Date(exam.startTime) &&
        currentDate <= new Date(exam.endTime)
      ) {
        status = "ongoing";
      } else if (currentDate > new Date(exam.endTime)) {
        status = "past";

        if (
          exam.resultPublishTime &&
          currentDate > new Date(exam.resultPublishTime)
        ) {
          resultPublished = true;
        }

        let avgData = await db.submission.aggregate({
          where: {
            examId: exam.id,
          },
          _avg: {
            marks: true,
          },
        });
        avgMarks = avgData?._avg.marks || 0;
      }

      return {
        ...exam,
        status,
        submission: exam.submissions?.[0],
        avgMarks,
        resultPublished,
      };
    })
  );

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
