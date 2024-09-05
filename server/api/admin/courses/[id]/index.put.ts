import { zh } from "h3-zod";
import { CourseSchema } from "~/schema/course.schema";

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, CourseSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const courseId = event.context.params?.id;

  if (!courseId) {
    return {
      statusCode: 400,
      statusMessage: "Invalid course id",
    };
  }

  await db.course.update({
    where: {
      id: courseId,
    },
    data: {
      title: data.title,
      description: data.description,
      image: data.image,
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Course created successfully",
  };
});
