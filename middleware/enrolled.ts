export default defineNuxtRouteMiddleware(async (to) => {
  try {
    const user = useUser();
    const { onOpen } = useLogin();
    if (!user.value) {
      return onOpen();
    }
    const enrollment = await isEnrolled(to.params.slug as string);
    if (enrollment && to.name == "shop-slug") {
      const response = await $fetch(`/api/category/${to.params.shop}`);
      if(response?.is_class){
          return navigateTo(`/${to.params.shop}/${to.params.slug}/dashboard`);
      }else{
          return navigateTo(`/${to.params.shop}/${to.params.slug}/exams`);
      }
            
     
    } else if (!enrollment && to.name !== "shop-slug") {
      
      return navigateTo(`/${to.params.shop}/${to.params.slug}`);
    }
  } catch (error) {
    console.error("Error checking enrollment:", error);
    return navigateTo("/error");
  }
});
