<template>
  <div>
    <AppContainer class="py-12">
      <h1 class="mb-8 text-4xl font-bold text-center">Course Categories</h1>
      <div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
        <Card v-for="category in categories" :key="category.id"
          class="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
          <CardContent class="p-4 text-center">
            <img :src="category.image" :alt="category.name"
              class="object-cover w-20 h-20 mx-auto mb-4 rounded-full" />
            <h3 class="mb-2 text-lg font-semibold">{{ category.name }}</h3>
            <p class="text-sm text-gray-600">{{ category.courseCount }} courses</p>
            <Button class="mt-4" variant="outline" @click="navigateTo(`/categories/${category.slug}`)">
              View Courses
            </Button>
          </CardContent>
        </Card>
      </div>
    </AppContainer>
  </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()

// Fetch all categories
const { data: categories } = await useFetch('/api/courses/categories')

// Error handling
if (!categories.value) {
  toast({
    title: 'Error',
    description: 'Failed to load categories. Please try again later.',
    variant: 'destructive'
  })
}
</script>