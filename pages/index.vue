<template>
  <div class="min-h-[76vh] bg-background">




    <!-- Featured Courses -->
    <HomeFeaturedCourses :courses="courses" />


  </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

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