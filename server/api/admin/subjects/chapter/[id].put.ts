import { zh } from "h3-zod";
import { ChapterSchema } from "~/schema/subject.schema";

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, ChapterSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const chapterId = event.context.params?.id;

  if (!chapterId) {
    return {
      statusCode: 400,
      statusMessage: "Invalid course id",
    };
  }

  await db.subject.update({
    where: {
      id: chapterId,
    },
    data: {
      name: data.name,
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
