<template>
  <div class="p-6 rounded-lg shadow-md bg-background">
    <h3 class="mb-2 text-xl font-semibold text-primary">{{ title }}</h3>
    <div class="flex items-center justify-between mb-2">
      <span class="">অগ্রগতি</span>
      <span class="font-semibold">{{ progress.total > 0 ? `${formatNumber(progress.percentage)}%` : 'প্রযোজ্য নয়'
        }}</span>
    </div>
    <div class="w-full bg-gray-200 rounded-full h-2.5">
      <div v-if="progress.total > 0" class="bg-primary h-2.5 rounded-full"
        :style="{ width: `${progress.percentage}%` }"></div>
      <div v-else class="bg-gray-400 h-2.5 rounded-full w-full"></div>
    </div>
    <div class="mt-2 text-sm text-gray-600">
      {{ progress.total > 0 ?
      `${formatNumber(progress.completed)} / ${formatNumber(progress.total)} সম্পন্ন` : 'কোনো অগ্রগতি নেই' }}
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