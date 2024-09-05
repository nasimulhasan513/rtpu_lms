import { zh } from "h3-zod";
import { SubjectSchema } from "~/schema/subject.schema";

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, SubjectSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const subjectId = event.context.params?.id;

  if (!subjectId) {
    return {
      statusCode: 400,
      statusMessage: "Invalid course id",
    };
  }

  await db.subject.update({
    where: {
      id: subjectId,
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
