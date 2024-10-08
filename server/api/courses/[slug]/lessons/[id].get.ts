import { z } from "zod";

const paramsSchema = z.object({
  slug: z.string(),
  id: z.string(),
});

export default defineEventHandler(async (event) => {
  try {
    const { slug, id } = paramsSchema.parse(event.context.params);

    const cacheKey = `lesson:${id}`;
    const cachedLesson = await getCache(cacheKey);

    let lessonData: any;
    if (cachedLesson) {
      lessonData = cachedLesson;
    } else {
      const lesson = await db.courseLesson.findFirst({
        where: {
          lesson: {
            id: id,
          },
          course: {
            slug: slug,
          },
        },
        include: {
          lesson: {
            include: {
              subject: true,
              chapter: true,
              teacher: true,
            },
          },
        },
      });

      if (!lesson) {
        throw createError({
          statusCode: 404,
          message: "Lesson not found",
        });
      }

      lessonData = {
        id: lesson.lesson.id,
        title: lesson.lesson.title,
        content: lesson.lesson.content,
        videoUrl:
          lesson.lesson.source === "youtube"
            ? lesson.lesson.content
            : undefined,
        pdf: lesson.lesson.pdf,
        chapterId: lesson.lesson.chapterId,
        subjectId: lesson.lesson.subjectId,
        subjectName: lesson.lesson.subject.name,
        chapterName: lesson.lesson.chapter.name,
        teacherImage: lesson.lesson.teacher.image,
        teacherName: lesson.lesson.teacher.name,
        teacherDesignation: lesson.lesson.teacher.designation,
      };

      await setCache(cacheKey, lessonData, 60 * 60 * 24 * 7);
    }

    const progress = await db.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: event.context.user?.id as string,
          lessonId: lessonData.id,
        },
      },
      create: {
        lessonId: lessonData.id,
        userId: event.context.user?.id as string,
        completed: false,
        lastVisited: new Date(),
      },
      update: {
        lastVisited: new Date(),
      },
    });

    // Count active users for this lesson within the last 30 minutes
    const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);
    const activeUsersCount = await db.lessonProgress.count({
      where: {
        lessonId: lessonData.id,
        lastVisited: {
          gte: thirtyMinutesAgo,
        },
      },
    });

    // Add the active users count to the response
    lessonData.activeUsersCount = activeUsersCount;

    return {
      lesson: lessonData,
      progress: progress,
      activeUsersCount,
    };
  } catch (error) {
    console.error("Error in lessons/[id].get.ts:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
