export default defineEventHandler(async (event) => {
  const categoris = await db.category.findMany();

  return categoris;
});
