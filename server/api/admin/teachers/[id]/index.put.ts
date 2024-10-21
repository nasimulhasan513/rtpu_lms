import { zh } from "h3-zod";
import { createTeacherSchema } from "~/schema/teacher.schema";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const { data, error } = await zh.useSafeValidatedBody(
    event,
    createTeacherSchema
  );

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  const updatedTeacher = await db.teacher.update({
    where: {
      id,
    },
    data: {
      name: data.name,
      image: data.image,
      designation: data.designation,
    },
  });

  return {
    success: true,
    data: updatedTeacher,
  };
});
