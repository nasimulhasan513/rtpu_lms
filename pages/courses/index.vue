<template>
  <div>
    <AppContainer v-if="!redirectLoading" class="py-12">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="course in courses" :key="course.id"
          class="overflow-hidden transition-all duration-300 bg-white rounded-lg hover:shadow-lg hover:-translate-y-1">
          <div class="relative">
            <NuxtImg :src="course.image" :alt="course.name" class="object-cover w-full h-56" />
          </div>
          <CardContent class="p-6">
            <h3 class="mb-2 text-xl font-semibold text-gray-900 line-clamp-2">
              {{ course.name }}
            </h3>
            <div class="flex items-center mt-4 text-sm text-gray-500">
              <Icon name="heroicons:clock" class="w-4 h-4 mr-1" />
              <span>{{ formatNumber(course.duration) }} মাস</span>
              <Icon name="heroicons:user-group" class="w-4 h-4 ml-4 mr-1" />
              <span>{{ formatNumber(course.enrolled) }} জন ভর্তি হয়েছেন</span>
            </div>
            <p class="mb-4 text-sm text-gray-600 line-clamp-3">
              {{ course.short_description }}
            </p>
            <div class="flex items-center justify-between mt-4" v-if="!course.is_enrolled">
              <div>
                <span class="text-2xl font-bold text-primary">Tk.{{ course.sale_price }}</span>
                <span v-if="course.regular_price > course.sale_price" class="ml-2 text-sm text-gray-500 line-through">
                  Tk. {{ course.regular_price }}
                </span>
              </div>
              <Button @click="navigateTo(`/courses/${course.slug}`)" variant="outline">
                বিস্তারিত
              </Button>
            </div>
            <div class="flex items-center justify-between mt-4" v-else>
              <AppButton label="ক্লাস শুরু করো" icon="lucide:chevron-right"
                @click="navigateTo(`/courses/${course.slug}`)" class="w-full gap-3" />
            </div>
          </CardContent>
        </Card>
      </div>
    </AppContainer>
    <div v-else>
      <AppContainer class="py-12">
        <AppLoader />
      </AppContainer>
    </div>
  </div>
</template>

<script setup>
import { useToast } from "@/components/ui/toast/use-toast";

const { toast } = useToast();

// Fetch all courses
const { data: courses } = await useFetch("/api/courses");

// Error handling
if (!courses.value) {
  toast({
    title: "Error",
    description: "Failed to load courses. Please try again later.",
    variant: "destructive",
  });
}

let redirectLoading = ref(false);

onMounted(() => {
  let redirect = localStorage.getItem("redirect");
  redirectLoading.value = redirect;
});
</script>
