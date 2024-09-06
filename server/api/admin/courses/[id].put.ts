import { zh } from "h3-zod";
import { CourseSchema } from "~/schema/course.schema";

export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, CourseSchema.partial());

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const courseId = event.context.params?.id;

  if (!courseId) {
    return {
      status: 400,
      statusMessage: "Course ID is required",
    };
  }

  try {
    const updatedCourse = await db.course.update({
      where: { id: courseId },
      data: {
        ...data,
        teachers: {
          set: data.teachers?.map(id => ({ id })) || [],
        },
      },
      include: {
        teachers: true,
        category: true,
      },
    });

    return {
      status: 200,
      body: updatedCourse,
      statusMessage: "Course updated successfully",
    };
  } catch (error) {
    console.error("Error updating course:", error);
    return {
      status: 500,
      statusMessage: "An error occurred while updating the course",
    };
  }
});