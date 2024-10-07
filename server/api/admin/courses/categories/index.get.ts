export default defineEventHandler(async (event) => {
  await validateRequest(event, ["admin", "contributor"]);

  const categoris = await db.category.findMany({});

  return categoris;
});
