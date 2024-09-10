import { z } from 'zod';

const videoInfoSchema = z.object({
  youtubeUrl: z.string().url(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  const { youtubeUrl } = videoInfoSchema.parse(body);

  try {
    const url = new URL(youtubeUrl);
    const videoId = url.searchParams.get('v');

    if (!videoId) {
      throw new Error('Invalid YouTube URL');
    }

    return { videoId };
  } catch (error) {
    throw createError({
      statusCode: 400,
      message: 'Failed to extract video ID',
    });
  }
});