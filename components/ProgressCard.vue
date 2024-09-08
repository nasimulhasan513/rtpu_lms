<template>
  <div class="p-6 rounded-lg shadow-md bg-background">
    <h3 class="mb-2 text-xl font-semibold">{{ title }}</h3>
    <div class="flex items-center justify-between mb-2">
      <span class="">Progress</span>
      <span class="font-semibold">{{ progress.percentage }}%</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div class="bg-primary h-2.5 rounded-full" :style="{ width: `${progress.percentage}%` }"></div>
    </div>
    <div class="mt-2 text-sm text-gray-600">
      {{ progress.completed }} / {{ progress.total }} completed
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  progress: {
    type: Object,
    required: true
  }
})
</script>