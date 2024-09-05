import { zh } from "h3-zod";
import { SignupSchema } from "~/schema/signup.schema";
import { validateRequest } from "~/server/utils/auth";

export default defineEventHandler(async (event) => {
  await validateRequest(event);

  const { data, error } = await zh.useSafeValidatedBody(event, SignupSchema);

  if (error) {
    return {
      statusCode: 400,
      body: error,
    };
  }

  await db.user.update({
    where: { id: event.context.user?.id },
    data: {
      name: data.name,
      phone: data.phone,
      district: data.district,
      thana: data.thana,
      institute: data.institute,
      hsc_batch: data.hsc_batch,
    },
  });
  return true;
});
