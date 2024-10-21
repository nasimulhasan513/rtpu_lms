export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN", "contributor"]);
  const teachers = await db.teacher.findMany();

  return teachers;
});
