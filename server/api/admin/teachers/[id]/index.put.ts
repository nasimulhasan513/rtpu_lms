import { zh } from "h3-zod";
import {
  createTeacherSchema,
  updateTeacherSchema,
} from "~/schema/teacher.schema";

export default defineEventHandler(async (event) => {
  const { id } = event.context.params;
  const { data, error } = await zh.useSafeValidatedBody(
    event,
    createTeacherSchema
  );
  const updatedTeacher = await db.teacher.update({
    where: {
      id,
    },
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
    data: updatedTeacher,
  };
});
