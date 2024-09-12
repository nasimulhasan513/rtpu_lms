// import lessons from "~/data/archieve.json";

export default defineEventHandler(async (event) => {
  try {
    const lessonData = [];

    await Promise.all(
      lessonData.map(async (lesson) => {
        if (!lesson.content) {
          lesson.content = "Error";
        }

        const createdLesson = await db.lesson.create({
          data: {
            title: lesson.topic,
            subject: {
              connect: {
                id: lesson.subjectId,
              },
            },
            chapter: {
              connect: {
                id: lesson.chapterId,
              },
            },
            content: lesson.content,
            is_archive: true,
            is_downloadable: false,
            source: "youtube",
            teacher: {
              connect: {
                id: "66dbfe08a30ac8ceb388830b",
              },
            },
            order: lesson.sl,
          },
        });

        await db.courseLesson.create({
          data: {
            courseId: "66dbfea7a30ac8ceb388830c",
            lessonId: createdLesson.id,
          },
        });
      })
    );

    return {
      success: true,
      message: `Created  lessons`,
    };
  } catch (error) {
    console.error("Error seeding lessons:", error);
    return {
      success: false,
      message: "Error seeding lessons",
      error: error instanceof Error ? error.message : String(error),
    };
  }
});
