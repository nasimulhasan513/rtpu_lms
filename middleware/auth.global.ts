export default defineNuxtRouteMiddleware(async (to) => {
  const user = useUser();
  const data = await useRequestFetch()("/api/user");
  if (data) {
    user.value = data;
  }
});
