export default defineEventHandler(async (event) => {
  await validateRequest(event, ["ADMIN", "contributor"]);

  const categoris = await db.category.findMany({});

  return categoris;
});
