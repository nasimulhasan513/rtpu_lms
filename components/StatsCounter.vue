<template>
  <section class="py-12 bg-gray-100">
    <AppContainer>
      <div class="grid grid-cols-2 gap-6 md:grid-cols-4">
        <div v-for="stat in stats" :key="stat.label" class="text-center">
          <h3 class="text-3xl font-bold text-primary">{{ stat.value }}</h3>
          <p class="text-gray-600">{{ stat.label }}</p>
        </div>
      </div>
    </AppContainer>
  </section>
</template>

<script setup>
const props = defineProps({
  stats: {
    type: Array,
    default: () => [
      { value: '100+', label: 'Courses' },
      { value: '50K+', label: 'Students' },
      { value: '200+', label: 'Instructors' },
      { value: '95%', label: 'Satisfaction Rate' },
    ],
  },
});
</script>