<template>
    <div class="p-4 border rounded-lg shadow-sm bg-background">
        <h3 class="mb-4 text-lg font-semibold">Exam Results</h3>

        <div class="grid grid-cols-2 gap-4">
            <StatCard title="Correct" :value="correct" color="bg-green-100 text-green-800" />
            <StatCard title="Wrong" :value="wrong" color="bg-red-100 text-red-800" />
            <StatCard title="Skipped" :value="skipped" color="bg-yellow-100 text-yellow-800" />
            <StatCard title="Total" :value="total" color="bg-blue-100 text-blue-800" />
        </div>
        <div class="mt-4">
            <!-- <Progress v-model="(correct / total) * 100" class="w-full" /> -->
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
        required: true
    },
    wrong: {
        type: Number,
        required: true
    },
    skipped: {
        type: Number,
        required: true
    },
    total: {
        type: Number,
        required: true
    }
})
</script>
