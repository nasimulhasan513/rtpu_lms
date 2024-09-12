import chapters from "~/data/qsbank.chapters.json";

export default defineEventHandler(async (event) => {
  const body = await readBody(event);

  try {
    const chaptersName = [
      "বৈদ্যুতিন চিঠি",
      "খুদে বার্তা",
      "বাংলা বানানের নিয়ম",
      "উপসর্গ",
      "প্রত্যয়",
      "বাংলা উচ্চারণের নিয়ম",
      "পদ প্রকরণ",
      "পারিভাষিক শব্দ",
      "বাক্য প্রকরণ",
      "প্রয়োগ অপপ্রয়োগ",
      "প্রতিবেদন",
      "রচনা",
      "নির্মিতি",
    ];

    const createdChapters = await db.chapter.createMany({
      data: chaptersName.map((chapter, index) => ({
        name: chapter,
        subjectId: "647ff2d1f75163e4d79200e4",
      })),
    });

    // delete chapters

    return {
      statusCode: 201,
      message: `Chapters created successfully`,
    };
  } catch (error) {
    console.error("Error creating chapters:", error);
    return createError({
      statusCode: 400,
      message:
        error instanceof z.ZodError
          ? error.errors[0].message
          : "Invalid chapter data",
    });
  }
});
