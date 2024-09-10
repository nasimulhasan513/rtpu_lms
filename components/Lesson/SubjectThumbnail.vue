<template>
    <div class="relative flex flex-col items-center justify-center text-center text-white transition-all duration-300 cursor-pointer rounded-xl hover:shadow-lg hover:scale-105 aspect-video bg-gradient-to-r"
        :class="randomGradient">
        <div class="mb-4">
            <h2 class="text-3xl font-bold">{{ subjectName }}</h2>
            <p class="text-xl">{{ subjectInitial }}</p>
        </div>
        <div>
            <p class="text-xl">ক্লাসসংখ্যা: {{ formatNumber(subject.totalLessons) }}</p>
        </div>
        <div class="absolute bottom-2 right-2">
            <Icon name="tabler:alphabet-bangla" size="40" />
        </div>
    </div>
</template>

<script setup>

const { subject } = defineProps({
    subject: {
        type: Object,
        required: true
    }
})


const subjectName = computed(() => {
    return subject.name.split(' ')[0]
})


const subjectInitial = computed(() => {
    return subject.name.replace(subjectName.value, '')
})

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
