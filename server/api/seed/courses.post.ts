
import { z } from 'zod';
import { faker } from '@faker-js/faker';

const countSchema = z.object({
  count: z.number().int().positive(),
});

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  
  try {
    const { count } = countSchema.parse(body);
    
    const categories = await db.category.findMany();
    if (categories.length === 0) {
      throw new Error('No categories found. Please create categories first.');
    }

    const courses = Array.from({ length: count }, () => ({
      slug: faker.helpers.slugify(faker.lorem.words(3)),
      name: faker.lorem.words(3),
      short_description: faker.lorem.sentence(),
      description: faker.lorem.paragraph(),
      categoryId: faker.helpers.arrayElement(categories).id,
      image: faker.image.url(),
      promo_video: faker.internet.url(),
      sale_price: faker.number.int({ min: 10, max: 100 }),
      regular_price: faker.number.int({ min: 100, max: 200 }),
      status: faker.helpers.arrayElement(['draft', 'published']),
      duration: faker.number.int({ min: 30, max: 180 }),
      enrolled: faker.number.int({ min: 0, max: 1000 }),
      fb_group: faker.internet.url(),
      tg_group: faker.internet.url(),
      keywords: faker.lorem.words(5).split(' '),
      order: faker.number.int({ min: 1, max: 100 }),
    }));
    
    const createdCourses = await db.course.createMany({
      data: courses,
    });

    return {
      statusCode: 201,
      message: `${createdCourses.count} courses created successfully`,
    };
  } catch (error) {
    console.error('Error creating courses:', error);
    return createError({
      statusCode: 400,
      message: error instanceof z.ZodError ? error.errors[0].message : 'Invalid course data',
    });
  }
});