<template>
  <div>
    <AppContainer v-if="!redirectLoading" class="py-12">
      <h1 class="mb-8 text-4xl font-bold text-center">All Courses</h1>
      <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        <Card v-for="course in courses" :key="course.id"
          class="overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <NuxtImg :src="course.image" :alt="course.name" class="object-contain w-full h-48" />
          <CardContent class="p-4">
            <h3 class="mb-2 text-xl font-semibold text-gray-900">{{ course.name }}</h3>
            <p class="mb-4 text-sm text-gray-600">{{ course.short_description }}</p>
            <div class="flex items-center justify-between">
              <span class="text-lg font-bold text-primary">৳{{ course.sale_price }}</span>
              <Button @click="navigateTo(`/courses/${course.slug}`)">View Course</Button>
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
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

// Fetch all courses
const { data: courses } = await useFetch('/api/courses')

// Error handling
if (!courses.value) {
  toast({
    title: 'Error',
    description: 'Failed to load courses. Please try again later.',
    variant: 'destructive'
  })
}


let redirectLoading = ref(false)

onMounted(() => {
  let redirect = localStorage.getItem('redirect')
  redirectLoading.value = redirect
})



</script>