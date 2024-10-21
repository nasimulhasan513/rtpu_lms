import { zh } from "h3-zod";
import { createTeacherSchema } from "~/schema/teacher.schema";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN"]);
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
      id: 'jsahdashdj',
      name: data.name,
      image: data.image,
      designation: data.designation,
    },
  });

  return {
    success: true,
    data: newTeacher,
  };
});
