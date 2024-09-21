<template>
  <div class="grid grid-cols-3 gap-5">
    <div v-for="(ranker, index) in rankers.slice(0, 3)" :key="index" :class="[
      'text-center transition-all duration-300 bg-white rounded-lg shadow-md p-4 relative',
      index === 0 ? 'order-2 -mt-10 border-4 border-yellow-400' :
        index === 1 ? 'order-1 border-4 border-gray-400' :
          'order-3 border-4 border-amber-600'
    ]">
      <div :class="[
      'rounded-full mx-auto mb-3 flex items-center justify-center text-white font-bold relative',
      index === 0 ? 'w-28 h-28 text-3xl' : 'w-24 h-24 text-2xl',
      index === 0 ? 'bg-yellow-400' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
    ]">
        <img :src="ranker.user.image" :alt="ranker.user.name"
          class="absolute inset-0 object-cover w-full h-full rounded-full" />

      </div>
      <div class="mb-1 text-lg font-semibold">{{ ranker.user.name }}</div>
      <div class="text-sm text-gray-600">{{ ranker.marks }} marks</div>
      <span variant="ghost" class="absolute top-2 left-2" :class="[
      index === 0 ? 'text-yellow-400' : index === 1 ? 'text-gray-400' : 'text-amber-600'
    ]">
        <Icon :name="getTrophyIcon(index)" class="text-2xl" />
      </span>
      <span variant="ghost" class="absolute top-1 right-2">
        {{ index + 1 }}{{ index === 0 ? 'st' : index === 1 ? 'nd' : 'rd' }}
      </span>
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

function getTrophyIcon(index) {
  switch (index) {
    case 0:
      return 'mdi:trophy'
    case 1:
      return 'mdi:medal'
    case 2:
      return 'mdi:medal-outline'
    default:
      return ''
  }
}
</script>