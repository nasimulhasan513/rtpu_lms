import { z } from "zod";

const querySchema = z.object({
  page: z.string().default("1"),
  limit: z.string().default("10"),
  search: z.string().optional(),
  subject_id: z.string().optional(),
  chapter_id: z.string().optional(),
  course_id: z.string().optional(),
});

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);

  try {
    const query = getQuery(event);
    const { page, limit, search, subject_id, chapter_id, course_id } =
      querySchema.parse(query);

    const pageNumber = parseInt(page);
    const limitNumber = parseInt(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const where = {
      AND: [
        search
          ? {
              OR: [
                { title: { contains: search, mode: "insensitive" } },
                { content: { contains: search, mode: "insensitive" } },
              ],
            }
          : {},
        subject_id ? { subject_id } : {},
        chapter_id ? { chapter_id } : {},
        course_id ? { courses: { some: { course_id } } } : {},
      ],
    };

    const [lessons, totalCount] = await Promise.all([
      db.lesson.findMany({
        where,
        include: {
          subject: true,
          chapter: true,
          courses: {
            include: {
              course: true,
            },
          },
        },
        skip,
        take: limitNumber,
        orderBy: { created_at: "desc" },
      }),
      db.lesson.count({ where }),
    ]);

    const formattedLessons = lessons.map((lesson) => ({
      ...lesson,
      courses: lesson.courses.map((cl) => cl.course),
    }));

    return {
      status: 200,
      body: {
        lessons: formattedLessons,
        totalCount,
        totalPages: Math.ceil(totalCount / limitNumber),
      },
    };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return {
      status: 500,
      statusMessage: "An error occurred while fetching lessons",
    };
  }
});
