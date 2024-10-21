import { z } from "zod";

export const examSchema = z.object({
  title: z.string(),
  courses: z.array(z.string()), // Fix: Specify the type of array elements
  subject_id: z.string(),
  start_time: z.string(),
  end_time: z.string(),
  description: z.string().optional().nullable(),
  duration: z.number(),
  total_marks: z.number(),
  instant_result: z.boolean(),
  result_publish_time: z.string(),
  pass_marks: z.number(),
  negative_marking: z.boolean(),
  shuffle_question: z.boolean(),
});
