
import chapters from '~/data/qsbank.chapters.json'

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    


    return {
      statusCode: 201,
      message: `${createdChapters.count} chapters created successfully`,
    };
  } catch (error) {
    console.error('Error creating chapters:', error);
    return createError({
      statusCode: 400,
      message: error instanceof z.ZodError ? error.errors[0].message : 'Invalid chapter data',
    });
  }
});