import { z } from "zod";
import { examSchema } from "~/schema/exam.schema";
import { formatDate } from "~/server/utils/format";

export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN", "MODERATOR"]);
  const id = event.context.params?.id;
  const body = await readBody(event);

  if (!id) {
    return createError({
      statusCode: 400,
      message: "Exam ID is required",
    });
  }

  try {
    const examData = examSchema.parse(body);

    const updatedExam = await db.exam.update({
      where: { id },
      data: {
        title: examData.title,
        description: examData.description,
        subject_id: examData.subject_id,
        duration: examData.duration,
        total_marks: examData.total_marks,
        negative_marking: examData.negative_marking,
        instant_result: examData.instant_result,
        shuffle_question: examData.shuffle_question,
        pass_marks: examData.pass_marks,
        start_time: formatDate(examData.start_time),
        end_time: formatDate(examData.end_time),
        result_publish_time: formatDate(examData.result_publish_time),
        course_exams: {
          deleteMany: {},
          create: examData.courses.map((courseId) => ({
            course_id: courseId,
          })),
        },
      },
    });

    return {
      statusCode: 200,
      body: "Exam updated successfully",
    };
  } catch (error) {
    console.error("Error updating exam:", error);
    return createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid exam data",
    });
  }
});
