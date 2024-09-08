import { z } from "zod";

const liveClassSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  startTime: z.string(),
  endTime: z.string(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const validatedData = liveClassSchema.parse(body);

  const user = event.context.user;
  if (!user) {
    throw createError({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  const liveClass = await db.liveClass.create({
    data: {
      ...validatedData,
      hostId: user.id,
      channelName: `live-class-${Date.now()}`,
      startTime: new Date(validatedData.startTime),
      endTime: new Date(validatedData.endTime),
    },
  });

  return liveClass;
});
