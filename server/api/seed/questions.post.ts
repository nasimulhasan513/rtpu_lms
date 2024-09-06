
import { z } from 'zod';
import { faker } from '@faker-js/faker';

const countSchema = z.object({
  count: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    const { count } = countSchema.parse(body);
    
    const subjects = await db.subject.findMany({ include: { chapters: true } });
    if (subjects.length === 0) {
      throw new Error('No subjects or chapters found. Please create subjects and chapters first.');
    }

    const questions = Array.from({ length: count }, () => {
      const subject = faker.helpers.arrayElement(subjects);
      const chapter = faker.helpers.arrayElement(subject.chapters);
      return {
        question: faker.lorem.sentence() + '?',
        difficulty: faker.helpers.arrayElement(['Easy', 'Medium', 'Hard']),
        subjectId: subject.id,
        chapterId: chapter.id,
        explain: faker.lorem.paragraph(),
        options: Array.from({ length: 4 }, (_, index) => ({
          option_text: faker.lorem.sentence(),
          correct: index === 0, // First option is always correct
        })),
      };
    });
    
    const createdQuestions = await db.$transaction(
      questions.map((question) =>
        db.question.create({
          data: {
            ...question,
            options: {
              create: question.options,
            },
          },
        })
      )
    );

    return {
      statusCode: 201,
      message: `${createdQuestions.length} questions created successfully`,
    };
  } catch (error) {
    console.error('Error creating questions:', error);
    return createError({
      statusCode: 400,
      message: error instanceof z.ZodError ? error.errors[0].message : 'Invalid question data',
    });
  }
});