import { z } from "zod";

const querySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => parseInt(val) || 1),
  limit: z
    .string()
    .optional()
    .transform((val) => parseInt(val) || 10),
});

export default defineEventHandler(async (event) => {
  // await validateRequest(event, ["admin"]);
  const query = getQuery(event);
  const { page, limit } = querySchema.parse(query);
  const skip = (page - 1) * limit;

  const courseId = event.context.params?.slug;

  const [enrollments, totalUsers] = await Promise.all([
    db.enrollment.findMany({
      skip,
      take: limit,
      where: { courseId: courseId as string },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            institute: true,
          },
        },
      },
      orderBy: { enrolledAt: "desc" },
    }),
    db.enrollment.count({ where: { courseId: courseId as string } }),
  ]);

  const userIds = enrollments.map((e) => e.user.id);

  const lessonProgressCounts = await db.lessonProgress.groupBy({
    by: ["userId"],
    where: {
      userId: { in: userIds },
      lesson: {
        courses: { some: { courseId: courseId as string } },
      },
    },
    _count: { _all: true },
  });

  const progressMap = new Map(lessonProgressCounts.map((p) => [p.userId, p]));

  const usersWithProgress = enrollments.map((enrollment) => ({
    ...enrollment,
    progress: progressMap.get(enrollment.user.id) || { _count: { _all: 0 } },
  }));

  return {
    page,
    limit,
    totalPages: Math.ceil(totalUsers / limit),
    totalUsers,
    users: usersWithProgress,
  };
});
