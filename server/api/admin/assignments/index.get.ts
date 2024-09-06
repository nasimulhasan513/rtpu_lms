export default defineEventHandler(async (event) => {
  const assignments = await db.assignment.findMany({
    include: { course: { select: { name: true } } },
  });
  return assignments;
});
