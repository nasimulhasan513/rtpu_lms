export default defineEventHandler(async (event) => {
  try {
    const lessons = await db.lesson.findMany({
      include: {
        subject: true,
        chapter: true,
        courses: {
          include: {
            course: true
          }
        }
      }
    });

    const formattedLessons = lessons.map(lesson => ({
      ...lesson,
      courses: lesson.courses.map(cl => cl.course)
    }));

    return {
      status: 200,
      body: formattedLessons
    };
  } catch (error) {
    console.error("Error fetching lessons:", error);
    return {
      status: 500,
      statusMessage: "An error occurred while fetching lessons"
    };
  }
});
