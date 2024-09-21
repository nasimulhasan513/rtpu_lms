<template>
  <div :class="['p-3 rounded-lg', color]">
    <h4 class="text-sm font-medium">{{ title }}</h4>
    <p class="text-2xl font-bold">{{ value }}{{ suffix }}</p>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: Number,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  suffix: {
    type: String,
    default: ''
  }
})
</script>