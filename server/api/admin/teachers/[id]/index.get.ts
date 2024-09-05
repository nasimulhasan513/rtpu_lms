
export default defineEventHandler(async (event) => {
  const { id } = event.context.params;

  const teacher = await db.teacher.findUnique({
    where: {
      id,
    },
  });

  if (!teacher) {
    return {
      success: false,
      message: "Teacher not found",
    };
  }

  return {
    success: true,
    data: teacher,
  };
});
