<template>
  <AppContainer>
    <div class="min-h-[76vh] bg-background">
      <section class="container py-12">
        <div class="flex flex-col mb-8 md:flex-row md:items-center md:justify-between">
          <h2 class="mb-4 text-3xl font-bold md:mb-0">
            কোর্স সমূহ
          </h2>
          <!-- <div class="relative">
            <input v-model="searchQuery" type="text" placeholder="Search categories..."
              class="w-full px-4 py-2 border rounded-md md:w-64 border-input bg-background" />
            <IconSearch class="absolute transform -translate-y-1/2 right-3 top-1/2 text-muted-foreground" />
          </div> -->
        </div>
        <div v-if="pending" class="flex items-center justify-center h-64">
          <AppLoader class="w-8 h-8" />
        </div>
        <div v-else-if="error" class="text-center text-destructive">
          <p>Failed to load categories. Please try again later.</p>
        </div>
        <div v-else>
          <div v-if="filteredCategories.length"
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            <CategoryCard v-for="category in filteredCategories" :key="category.id" :category="category" />
          </div>
          <div v-else class="py-12 text-center text-muted-foreground">
            No categories found matching your search.
          </div>
        </div>
      </section>
    </div>
  </AppContainer>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'

const { toast } = useToast()
const searchQuery = ref('')

// Fetch categories
const { data: categories, pending, error } = await useFetch('/api/courses/categories')

// Error handling
if (error.value) {
  toast({
    title: 'Error',
    description: 'Failed to load categories. Please try again later.',
    variant: 'destructive'
  })
}

// Filter categories based on search query
const filteredCategories = computed(() => {
  if (!categories.value) return []
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
</script>