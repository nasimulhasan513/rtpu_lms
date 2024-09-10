<template>
  <section class="py-16">
    <AppContainer>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="course in courses" :key="course.id"
          class="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <div class="relative w-full h-48 overflow-hidden">
            <NuxtImg :src="course.image" :alt="course.name" class="object-cover w-full" :width="course.image.width" />
          </div>
          <CardContent class="p-4">
            <h3 class="mb-2 text-xl font-semibold">{{ course.name }}</h3>
            <p class="mb-4 text-sm text-gray-500">{{ course.short_description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-primary">
                <!-- ৳{{ course.sale_price }} -->
              </span>
              <Button @click="navigateTo(`/courses/${course.slug}`)">কোর্সের বিস্তারিত</Button>
            </div>
          </CardContent>
        </Card>
      </div>

    </AppContainer>
  </section>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: 'Featured Courses',
  },
  courses: {
    type: Array,
    required: true,
  },
});
</script>