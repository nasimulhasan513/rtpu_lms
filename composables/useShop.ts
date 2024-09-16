import type { Category, Course } from "@prisma/client";

export const useShop = () => {
  const shop = useState<Category | null>("shop", () => null);
  const courses = ref<Course[]>([]);
  const route = useRoute();
  const status = ref<"loading" | "success" | "error">("loading");
  const shopStatus = ref<"loading" | "success" | "error">("loading");
  const fetchShop = async () => {
    if (!route.params.shop) {
      return;
    }

    if (route.params.shop === shop.value?.slug) {
      return;
    }

    shopStatus.value = "loading";
    const response = await $fetch(`/api/category/${route.params.shop}`);
    shop.value = response as Category;
    shopStatus.value = "success";

    
  };

  const fetchCourses = async () => {
    if (!route.params.shop) {
      return;
    }
    status.value = "loading";
    const response = await $fetch(`/api/category/${route.params.shop}/courses`);
    courses.value = response as Course[];
    status.value = "success";
  };

  return {
    shop,
    status,
    shopStatus,
    fetchShop,
    courses,
    fetchCourses,
  };
};
