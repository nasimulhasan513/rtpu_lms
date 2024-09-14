<template>
  <div class="flex justify-center space-x-4">
    <div v-for="(ranker, index) in rankers" :key="index" class="text-center">
      <div :class="[
        'rounded-full w-20 h-20 mx-auto mb-2 flex items-center justify-center text-white text-2xl font-bold relative',
        index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
      ]">
        <img
          :src="ranker.user.image"
          :alt="ranker.user.name"
          class="absolute inset-0 object-cover w-full h-full rounded-full"
        />
        <div class="absolute inset-0 flex items-center justify-center bg-black rounded-full bg-opacity-30">
          {{ index + 1 }}
        </div>
      </div>
      <div class="font-semibold">{{ ranker.user.name }}</div>
      <div class="text-sm text-gray-600">{{ ranker.marks }} marks</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  rankers: {
    type: Array,
    required: true
  }
})
</script>