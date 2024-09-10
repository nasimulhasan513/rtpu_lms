export default defineNuxtRouteMiddleware(async () => {
  const user = useUser();
  const route = useRoute();

  // Check if the user's role is 'user' and the route includes 'admin'
  if (user.value && user.value.role === "user") {
    return navigateTo("/");
  }
});
