<template>
    <div class="flex space-x-2 sm:space-x-4">
        <TimeUnit v-for="unit in timeUnits" :key="unit.label" :value="unit.value" :label="unit.label"
            :color="unit.color" />
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import TimeUnit from './TimeUnit.vue'

const props = defineProps({
    end: {
        type: String,
        required: true
    }
})

const days = ref(0)
const hours = ref(0)
const minutes = ref(0)
const seconds = ref(0)

const timeUnits = computed(() => [
    { label: 'দিন', value: days.value, color: 'red' },
    { label: 'ঘন্টা', value: hours.value, color: 'blue' },
    { label: 'মিনিট', value: minutes.value, color: 'indigo' },
    { label: 'সেকেন্ড', value: seconds.value, color: 'emerald' }
])

const updateTime = () => {
    const now = Date.now()
    const distance = new Date(props.end).getTime() - now

    if (distance < 0) {
        clearInterval(timer)
        return
    }

    days.value = Math.floor(distance / (1000 * 60 * 60 * 24))
    hours.value = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    minutes.value = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
    seconds.value = Math.floor((distance % (1000 * 60)) / 1000)
}

let timer: NodeJS.Timeout

onMounted(() => {
    updateTime()
    timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
    clearInterval(timer)
})
</script>
