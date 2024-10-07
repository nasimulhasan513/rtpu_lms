export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin", "contributor"]);
  const teachers = await db.teacher.findMany();

  return teachers;
});
