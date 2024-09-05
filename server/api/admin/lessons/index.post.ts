import { zh } from "h3-zod";
import { LessonSchema } from "~/schema/lesson.schema";

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, LessonSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  await db.lesson.create({
    data: {
      title: data.title,
      subjectId: data.subjectId,
      chapterId: data.chapterId,
      source: data.source,
      content: data.content,
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
