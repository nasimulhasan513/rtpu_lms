export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin"]);

  const courseId = event.context.params?.id;

  if (!courseId) {
    return {
      status: 400,
      statusMessage: "Course ID is required",
    };
  }

  try {
    await db.$transaction(async (tx) => {
      // Delete associated CourseLesson records
      await tx.courseLesson.deleteMany({
        where: { courseId },
      });

      // Delete associated CourseExam records
      await tx.courseExam.deleteMany({
        where: { courseId },
      });

      // Delete associated CourseTeacher records
      await tx.courseTeacher.deleteMany({
        where: { courseId },
      });

      await tx.contributor.deleteMany({
        where: { courseId },
      });

      // Delete the course
      await tx.course.delete({
        where: { id: courseId },
      });
    });

    return {
      status: 200,
      statusMessage: "Course deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting course:", error);
    return {
      status: 500,
      statusMessage: "An error occurred while deleting the course",
    };
  }
});
