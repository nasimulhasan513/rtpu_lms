export default defineNuxtRouteMiddleware(async (from, to) => {
  const user = useUser();
  const { onOpen } = useLogin();
  if (!user.value) {
    return onOpen();
  }

  if (!user.value.name && to.name !== "edit") {
    console.log("User name is missing, redirecting to edit page...");

    return navigateTo("/edit");
  }
});
