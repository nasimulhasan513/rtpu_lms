import { zh } from "h3-zod";
import { SubjectSchema } from "~/schema/subject.schema";
export default defineEventHandler(async (event) => {
  const { data, error } = await zh.useSafeValidatedBody(event, SubjectSchema);

  if (error) {
    return {
      status: 400,
      statusMessage: error,
    };
  }

  await db.subject.create({
    data: {
      name: data.name,
     
    },
  });

  return {
    statusCode: 201,
    statusMessage: "Subject created successfully",
  };
});
