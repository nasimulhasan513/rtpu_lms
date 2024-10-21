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

  await db.chapter.create({
    data: {
      name: data.name,
      subject_id: data.subjectId,
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
