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

    let lessonData:any;
    if (cachedLesson) {
      lessonData = cachedLesson;
    }else{
      const lesson = await db.courseLesson.findFirst({
        where: {
          lesson: {
            id: id
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
      }

      await setCache(cacheKey, lessonData, 60 * 60 * 24 * 7);
    }

    let progress = await db.lessonProgress.findFirst({
      where: {
        lessonId: lessonData.id,
        userId: event.context.user?.id,
      },
    });

    if (!progress) {
      progress = await db.lessonProgress.create({
        data: {
          lessonId: lesson.lesson.id,
          userId: event.context.user?.id,
          completed: false,
        },
      });
    }


    return {
      lesson: lessonData,
      progress: progress,
    };
  } catch (error) {
    console.error("Error in lessons/[id].get.ts:", error);
    throw createError({
      statusCode: 500,
      message: "Internal server error",
    });
  }
});
