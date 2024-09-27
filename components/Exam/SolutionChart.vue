<template>
    <div class="p-4 space-y-3 border rounded-lg shadow-sm bg-background">
        <div class="flex justify-between">
            <h3 class="text-lg font-semibold ">Summary</h3>
            <p class="text-lg text-primary">
                {{ formatNumber(correct) }} / {{ formatNumber(total) }}
            </p>
        </div>


        <div>
            <!-- <Progress v-model="(correct / total) * 100" class="w-full" /> -->
            <div class="w-full bg-gray-200 rounded-full h-2.5">
                <div v-if="total > 0" class="bg-primary h-2.5 rounded-full"
                    :style="{ width: `${(correct / total) * 100}%` }"></div>
                <div v-else class="bg-gray-400 h-2.5 rounded-full w-full"></div>
            </div>
        </div>

        <div class="grid grid-cols-2 gap-4 pt-3">
            <ExamStatCard title="Correct" :value="correct" color="bg-green-100 text-green-800" />
            <ExamStatCard title="Wrong" :value="wrong" color="bg-red-100 text-red-800" />
            <ExamStatCard title="Skipped" :value="skipped" color="bg-yellow-100 text-yellow-800" />
            <ExamStatCard title="Accuracy" :value="accuracy === 'NaN' ? '0' : accuracy" suffix="%"
                color="bg-blue-100 text-blue-800" />
        </div>


        <div v-if="Object.keys(subjectWiseMarks).length > 1">
            <div class="mt-4">
                <h4 class="mb-2 text-lg font-semibold">Subject-wise Performance</h4>
                <div class="space-y-2">
                    <div v-for="(marks, subject) in subjectWiseMarks" :key="subject"
                        class="flex items-center justify-between p-2 bg-gray-100 rounded-md">
                        <span class="font-medium">{{ subject }}</span>
                        <span class="text-primary">{{ formatNumber(marks) }}</span>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup>

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
    },
    subjectWiseMarks: {
        type: Object,
        default: () => ({})
    }
})



const accuracy = computed(() => {
    return ((props.correct / (props.correct + props.wrong)) * 100).toFixed(2)
})




</script>
