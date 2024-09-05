import { zh } from "h3-zod";
import { createTeacherSchema } from "~/schema/teacher.schema";

export default defineEventHandler(async (event) => {
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

  const newTeacher = await db.teacher.create({
    data: {
      name: data.name,
      image: data.image,
      biography: data.biography,
      designation: data.designation,
      short_designation: data.short_designation,
    },
  });

  return {
    success: true,
    data: newTeacher,
  };
});
