<template>
  <div>
    <!-- Hero Section -->
    <section class="relative text-white bg-primary">
      <AppContainer class="py-20 md:py-32">
        <div class="max-w-3xl">
          <h1 class="mb-4 text-4xl font-bold md:text-5xl lg:text-6xl">Learn Without Limits</h1>
          <p class="mb-8 text-lg md:text-xl">Discover a world of knowledge with our comprehensive online courses.</p>
          <div class="flex flex-wrap gap-4">
            <Button size="lg" @click="navigateTo('/courses')">
              Explore Courses
            </Button>
            <Button size="lg" variant="outline" class="text-white border-white hover:bg-white hover:text-primary">
              Join for Free
            </Button>
          </div>
        </div>
      </AppContainer>
      <div class="absolute inset-0 z-0 opacity-10">
        <!-- <img src="/images/hero-pattern.svg" alt="Hero Pattern" class="object-cover w-full h-full" /> -->
      </div>
    </section>

    <!-- Stats Counter -->
    <StatsCounter />

    <!-- Categories Section -->
    <section class="py-16">
      <AppContainer>
        <h2 class="mb-8 text-3xl font-bold text-center">Explore Top Categories</h2>
        <div class="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-4">
          <Card v-for="category in categories" :key="category.id"
            class="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardContent class="p-4 text-center">
              <img :src="category.image" :alt="category.name"
                class="object-cover w-20 h-20 mx-auto mb-4 rounded-full" />
              <h3 class="mb-2 text-lg font-semibold">{{ category.name }}</h3>
              <p class="text-sm text-gray-600">{{ category.courseCount }} courses</p>
            </CardContent>
          </Card>
        </div>
      </AppContainer>
    </section>

    <!-- Featured Courses -->
    <FeaturedCourses :courses="courses" />

    <!-- CTA Section -->
    <section class="py-20 text-white bg-primary">
      <AppContainer class="text-center">
        <h2 class="mb-4 text-3xl font-bold md:text-4xl">Ready to Start Learning?</h2>
        <p class="mb-8 text-lg">Join thousands of students and start your learning journey today.</p>
        <Button size="lg" variant="secondary" @click="navigateTo('/signup')">
          Sign Up Now
        </Button>
      </AppContainer>
    </section>
  </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'
import StatsCounter from '@/components/StatsCounter.vue'
import FeaturedCourses from '@/components/FeaturedCourses.vue'

const { toast } = useToast()

// Fetch categories
const { data: categories } = await useFetch('/api/courses/categories')

// Fetch featured courses
const { data: courses } = await useFetch('/api/courses', {
  params: { featured: true, limit: 6 }
})

// Error handling
if (!categories.value || !courses.value) {
  toast({
    title: 'Error',
    description: 'Failed to load content. Please try again later.',
    variant: 'destructive'
  })
}
</script>