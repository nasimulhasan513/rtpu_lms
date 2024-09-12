<template>
  <Card class="transition-all duration-300 cursor-pointer bg-gradient-to-r hover:shadow-lg hover:scale-105"
    :class="randomGradient" @click="navigateLesson(lesson)">
    <CardContent class="relative p-2">
      <NuxtImg :src="thumbnailUrl" :alt="lesson.name" class="object-cover w-full rounded aspect-video" />
      <div class="absolute inset-0 flex items-center justify-center">
        <Icon name="heroicons:play-circle" class="w-10 h-10 text-white opacity-80" />
      </div>
    </CardContent>
    <CardFooter class="px-2 pb-2">
      <div class="flex items-center justify-center w-full ">
        <p class="text-lg font-semibold text-white">{{ lesson.title }}</p>
      </div>
    </CardFooter>
  </Card>
</template>

<script setup>

const props = defineProps({
  lesson: {
    type: Object,
    required: true
  }
})

const thumbnailUrl = computed(() => {
  const videoId = getYouTubeVideoId(props.lesson.content)
  return `https://img.youtube.com/vi/${videoId}/0.jpg`
})

function getYouTubeVideoId(url) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
  const match = url.match(regExp)
  return (match && match[2].length === 11) ? match[2] : null
}

const route = useRoute()

const navigateLesson = (lesson) => {
  navigateTo(`/courses/${route.params.slug}/lessons/${lesson.id}`)
}


const gradientColors = [
  'from-rose-500 via-rose-600 to-rose-400',
  'from-emerald-500 via-emerald-600 to-emerald-400',
  'from-indigo-500 via-indigo-600 to-indigo-400',
  'from-blue-500 via-blue-600 to-blue-400',
  'from-green-500 via-green-600 to-green-400',
  'from-yellow-500 via-yellow-600 to-yellow-400',
  'from-red-500 via-red-600 to-red-400',
  'from-purple-500 via-purple-600 to-purple-400',
  'from-pink-500 via-pink-600 to-pink-400',

]


const randomGradient = computed(() => {
  const randomIndex = Math.floor(Math.random() * gradientColors.length)
  return gradientColors[randomIndex]
})
</script>