import { assignmentSchema } from "~/schema/assignment.schema";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

 
  const validatedData = assignmentSchema.parse(body);

  const assignment = await db.assignment.create({
    data: {
      title: validatedData.title,
      description: validatedData.description,
      courseId: validatedData.courseId,
      total_marks: validatedData.total_marks,
      startDate: validatedData.startDate,
      endDate: validatedData.endDate,
      pdf: validatedData.pdf,
      status: validatedData.status,
    },
  });

  return assignment;
});
