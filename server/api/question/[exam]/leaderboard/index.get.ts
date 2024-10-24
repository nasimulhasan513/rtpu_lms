import { EXAM_LEADERBOARD } from "~/server/utils/cachekeys";

export default defineEventHandler(async (event) => {
  const exam = event.context.params?.exam;

  const role = event.context.user?.role;

  if (!exam) {
    throw createError({
      statusCode: 400,
      statusMessage: "examId query parameter is required",
    });
  }

  const query = getQuery(event);

  // Get pagination parameters from the query string
  const page = parseInt(query.page as string, 10) || 1;
  const pageSize = parseInt(query.pageSize as string, 10) || 25;
  const search = query.search ? query.search.toString().trim() : "";

  // Calculate the offset
  const skip = (page - 1) * pageSize;

  const cacheKey = `${EXAM_LEADERBOARD}:${exam}:${page}:${pageSize}:${search}`;

  const cachedLeaderboard = await getCache(cacheKey);

  if (cachedLeaderboard && role === "user") {
    return cachedLeaderboard;
  }

  const examData = await db.exam.findUnique({
    where: {
      id: exam as string,
    },
    include: {
      courseExams: {
        include: {
          course: {
            select: {
              name: true,
              slug: true,
            },
          },
        },
      },
    },
  });

  // Fetch the leaderboard data with search, pagination, and sorting
  const leaderboard = await db.submission.findMany({
    where: {
      examId: exam as string,
      user: {
        name: {
          contains: search,
          mode: "insensitive",
        },
      },
    },
    orderBy: [
      {
        passed: "desc",
      },
      {
        marks: "desc",
      },
      {
        duration: "asc",
      },
    ],
    select: {
      id: true,
      user: {
        select: {
          name: true,
          institute: true,
          image: true,
          ...(role !== "user" ? { id: true, phone: true, email: true } : {}),
        },
      },
      marks: true,
      correct: true,
      wrong: true,
      skipped: true,
      duration: true,
      submittedAt: true,
      subjectBreakDown: true,
      passed: true,
    },
    skip: skip, // Skip the records for pagination
    take: pageSize, // Limit the number of records
  });

  // Fetch the total count of submissions for the exam with the search filter applied
  const totalSubmissions = await db.submission.count({
    where: {
      examId: exam as string,
    },
  });

  const data = {
    examData,
    leaderboard,
    pagination: {
      page,
      pageSize,
      total: totalSubmissions,
      totalPages: Math.ceil(totalSubmissions / pageSize),
    },
  };

 
  if(role === "user"){
    await setCache(cacheKey, data);
  }

  return data;
});
