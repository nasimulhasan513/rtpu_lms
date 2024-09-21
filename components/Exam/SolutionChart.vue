<template>
    <div class="p-4 border rounded-lg shadow-sm bg-background">
        <h3 class="mb-4 text-lg font-semibold">Summary</h3>

        <div class="grid grid-cols-2 gap-4">
            <ExamStatCard title="Correct" :value="correct" color="bg-green-100 text-green-800" />
            <ExamStatCard title="Wrong" :value="wrong" color="bg-red-100 text-red-800" />
            <ExamStatCard title="Skipped" :value="skipped" color="bg-yellow-100 text-yellow-800" />
            <ExamStatCard title="Total" :value="total" color="bg-blue-100 text-blue-800" />
        </div>
        <div class="mt-4">
            <!-- <Progress v-model="(correct / total) * 100" class="w-full" /> -->
            <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div v-if="total > 0" class="bg-primary h-2.5 rounded-full"
                    :style="{ width: `${(correct / total) * 100}%` }"></div>
                <div v-else class="bg-gray-400 h-2.5 rounded-full w-full"></div>
            </div>
        </div>
        <p class="mt-2 text-sm text-gray-600">
            Obtained Marks: {{ correct }} / {{ total }}
        </p>
    </div>
</template>

<script setup>
import { Progress } from '@/components/ui/progress'

const props = defineProps({
    correct: {
        type: Number,
        default: 0
    },
    wrong: {
        type: Number,
        default: 0
    },
    skipped: {
        type: Number,
        default: 0
    },
    total: {
        type: Number,
        default: 0
    }
})
</script>
