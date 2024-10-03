import { z } from "zod";

export const examSchema = z.object({
  title: z.string(),
  courses: z.array(z.string()), // Fix: Specify the type of array elements
  subjectId: z.string(),
  startTime: z.string(),
  endTime: z.string(),
  description: z.string().optional().nullable(),
  duration: z.number(),
  totalMarks: z.number(),
  instantResult: z.boolean(),
  resultPublishTime: z.string().optional(),
  passMarks: z.number(),
  negativeMarking: z.boolean(),
  shuffleQuestion: z.boolean(),
});
