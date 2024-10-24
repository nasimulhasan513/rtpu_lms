export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const user = useUser();
    const { onOpen } = useLogin();
    if (!user.value) {
      if (to.name === "shop-slug") {
        return onOpen();
      } else {
        return navigateTo(`/${to.params.shop}`);
      }
    }
    const enrollment = await isEnrolled(to.params.slug as string);
    if (enrollment && to.name == "shop-slug") {
      const response = await $fetch(`/api/category/${to.params.shop}`);
      if (response?.is_class) {
        return navigateTo(`/${to.params.shop}/${to.params.slug}/lessons`);
      } else {
        return navigateTo(`/${to.params.shop}/${to.params.slug}/mcq`);
      }
    } else if (!enrollment && to.name !== "shop-slug") {
      return navigateTo(`/${to.params.shop}/${to.params.slug}`);
    }
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return navigateTo("/error");
  }
});
