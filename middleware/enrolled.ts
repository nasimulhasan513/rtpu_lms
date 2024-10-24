export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const user = useUser();
    const { onOpen } = useLogin();
    if (!user.value) {
      if (to.name === "courses-slug") {
        return onOpen();
      } else {
        return navigateTo(`/courses/${to.params.slug}`);
      }
    }
    const enrollment = await isEnrolled(to.params.slug as string);
    if (enrollment && to.name == "courses-slug") {
      return navigateTo(`/courses/${to.params.slug}/dashboard`);
    } else if (!enrollment && to.name !== "courses-slug") {
      return navigateTo(`/courses/${to.params.slug}`);
    }
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return navigateTo("/error");
  }
});
