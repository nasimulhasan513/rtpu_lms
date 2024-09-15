export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();

  if (!user.value) {
    return navigateTo("/");
  }

  // Check if the user's role is 'user' and the route includes 'admin'
  if (user.value && user.value.role === "user") {
    return navigateTo("/");
  }
});
