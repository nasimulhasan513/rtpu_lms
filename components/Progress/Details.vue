<template>
    <div>
        <Button v-if="subjectBreakDown && subjectBreakDown.length > 1" @click="openModal" variant="ghost"
            class="gap-1 p-0 ml-1" :class="isPassed ? 'text-green-500' : 'text-red-500'">
            {{ isPassed ? '' : '(Failed)' }}
            <Icon name="lucide:info" class="w-4 h-4" />
        </Button>
        <Button v-else-if="subjectBreakDown" variant="ghost" class="gap-1 p-0 ml-1"
            :class="isPassed ? 'text-green-500' : 'text-red-500'">
            {{ isPassed ? '' : '(Failed)' }}
        </Button>

        <Dialog :open="isOpen" @update:open="isOpen = $event">
            <DialogContent class="sm:max-w-[425px] overflow-y-scroll hide-scrollbar">

                <div class="mt-2 space-y-4">


                    <!-- Subject Breakdown Section -->
                    <div v-for="subject in subjectBreakDown" :key="subject.subjectId"
                        class="p-4 mb-4 border rounded-lg dark:bg-gray-800">
                        <div class="flex items-center justify-between mb-2">
                            <span class="text-lg font-semibold">{{ subject.subjectName }}</span>
                            <Badge :variant="subject.isPassed ? 'default' : 'destructive'">
                                {{ subject.isPassed ? 'Passed' : 'Failed' }}
                            </Badge>
                        </div>
                        <div class="grid grid-cols-2 gap-4 text-sm">
                            <div class="flex items-center">
                                <Icon name="lucide:circle-check" class="mr-2 text-green-500" size="18" />
                                <span>Correct: {{ subject.correct }}</span>
                            </div>
                            <div class="flex items-center">
                                <Icon name="lucide:circle-x" class="mr-2 text-red-500" size="18" />
                                <span>Wrong: {{ subject.wrong }}</span>
                            </div>
                            <div class="flex items-center">
                                <Icon name="lucide:circle-minus" class="mr-2 text-gray-500" size="18" />
                                <span>Skipped: {{ subject.skipped }}</span>
                            </div>
                            <div class="flex items-center">
                                <Icon name="lucide:award" class="mr-2 text-primary" size="18" />
                                <span>Marks: {{ subject.marks.toFixed(2) }}</span>
                            </div>
                        </div>
                        <div class="relative w-full h-2 mt-4 bg-gray-200 rounded-full dark:bg-gray-700">
                            <div class="absolute top-0 left-0 h-full rounded-full"
                                :class="subject.isPassed ? 'bg-green-500' : 'bg-red-500'"
                                :style="{ width: `${(subject.marks / (subject.correct + subject.wrong + subject.skipped)) * 100}%` }">
                            </div>
                        </div>
                        <div class="flex items-center justify-between mt-2 text-sm">
                            <span>Score: {{ ((subject.marks / (subject.correct + subject.wrong + subject.skipped)) *
            100).toFixed(2) }}%</span>
                            <span>Pass Mark: {{ passMark }}%</span>
                        </div>
                    </div>
                </div>

            </DialogContent>
        </Dialog>
    </div>
</template>

<script setup>
const props = defineProps({
    subjectBreakDown: {
        type: Object,
        required: true
    },
    passMark: {
        type: Number,
        required: true
    },
    isPassed: {
        type: Boolean,
        required: true
    }
})

const isOpen = ref(false)

const openModal = () => {
    isOpen.value = true
}

const closeModal = () => {
    isOpen.value = false
}


</script>

<style lang="scss" scoped></style>