export default defineEventHandler(async (event) => {
  const teachers = await db.teacher.findMany();

  return teachers;
});
