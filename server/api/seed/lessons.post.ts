import { z } from "zod";
import { faker } from "@faker-js/faker";

const countSchema = z.object({
  count: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const { count } = countSchema.parse(body);

    const subjects = await db.subject.findMany({ include: { chapters: true } });
    if (subjects.length === 0) {
      throw new Error("No subjects found. Please create subjects first.");
    }

    const lessons = [];
    for (let i = 0; i < count; i++) {
      const subject = faker.helpers.arrayElement(subjects);
      if (subject.chapters.length === 0) {
        continue; // Skip this iteration if the subject has no chapters
      }
      const chapter = faker.helpers.arrayElement(subject.chapters);

      lessons.push({
        title: faker.lorem.sentence(),
        subjectId: subject.id,
        chapterId: chapter.id,
        source: "youtube",
        content: faker.lorem.paragraphs(),
        pdf: faker.helpers.maybe(() => faker.internet.url(), {
          probability: 0.3,
        }),
        order: faker.number.int({ min: 1, max: 100 }),
      });
    }

    if (lessons.length === 0) {
      throw new Error("No lessons could be created. Please ensure subjects have chapters.");
    }

    const createdLessons = await db.lesson.createMany({
      data: lessons,
    });

    return {
      statusCode: 201,
      message: `${createdLessons.count} lessons created successfully`,
    };
  } catch (error) {
    console.error("Error creating lessons:", error);
    return createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid lesson data",
    });
  }
});
