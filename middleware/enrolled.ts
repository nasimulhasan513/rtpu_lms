export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const user = useUser();
    const { onOpen } = useLogin();
    if (!user.value) {
      return onOpen();
    }
    const { fetchShop } = useShop();
    if (to.params.shop) {
      fetchShop();
    }

    const enrollment = await isEnrolled(to.params.slug as string);
    if (enrollment && to.name == "shop-slug") {
      return navigateTo(`/${to.params.shop}/${to.params.slug}/dashboard`);
    } else if (!enrollment && to.name !== "shop-slug") {
      return navigateTo(`/${to.params.shop}/${to.params.slug}`);
    }
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return navigateTo("/error");
  }
});
