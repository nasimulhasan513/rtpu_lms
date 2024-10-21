import { z } from "zod";
import { examSchema } from "~/schema/exam.schema";
import { formatDate } from "~/server/utils/format";



export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN", "MODERATOR"]);

  const body = await readBody(event);

  try {
    const examData = examSchema.parse(body);

    const exam = await db.exam.create({
      data: {
        title: examData.title,
        description: examData.description,
        start_time: formatDate(examData.start_time),
        end_time: formatDate(examData.end_time),
        duration: examData.duration,
        total_marks: examData.total_marks,
        instant_result: examData.instant_result,
        result_publish_time: formatDate(examData.result_publish_time),
        negative_marking: examData.negative_marking,
        pass_marks: examData.pass_marks,
        shuffle_question: examData.shuffle_question,
        subject: {
          connect: { id: examData.subject_id }
        },
        course_exams: {
            create: examData.courses.map((courseId) => ({ course_id: courseId }))
        }
      },
    });

    return {
      statusCode: 201,
      body: exam,
    };
  } catch (error) {
    console.error("Error creating exam:", error);
    return createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid exam data",
    });
  }
});
