
import { z } from 'zod';
import { faker } from '@faker-js/faker';

const countSchema = z.object({
  count: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    const { count } = countSchema.parse(body);
    
    const subjects = await db.subject.findMany();
    if (subjects.length === 0) {
      throw new Error('No subjects found. Please create subjects first.');
    }

    const chapters = Array.from({ length: count }, () => ({
      name: faker.lorem.words(3),
      subjectId: faker.helpers.arrayElement(subjects).id,
    }));
    
    const createdChapters = await db.chapter.createMany({
      data: chapters,
    });

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