import { z } from "zod";

const updateLiveClassSchema = z.object({
  status: z.enum(["SCHEDULED", "LIVE", "ENDED"]),
});

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id;
  if (!id) {
    throw createError({
      statusCode: 400,
      message: "Missing live class ID",
    });
  }

  const body = await readBody(event);
  const { status } = updateLiveClassSchema.parse(body);

  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const updatedLiveClass = await db.liveClass.update({
    where: { id, hostId: user.id },
    data: { status },
  });

  return updatedLiveClass;
});
