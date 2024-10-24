<template>

    <div class="min-h-screen bg-white">
        <header class="sticky top-0 z-10 bg-white border-b border-gray-200 shadow-sm">
            <AppContainer>
                <div class="container flex items-center justify-between px-2 py-4 mx-auto md:px-4">
                    <h1 class="hidden text-xl font-bold text-gray-800 md:block">{{ data.exam.title }}</h1>
                    <div class="flex items-center justify-between flex-1 space-x-4 md:justify-end">
                        <div v-if="end_time && !isSubmitted" class="flex gap-4 text-lg font-semibold text-slate-800">
                            <!-- Time Left: -->
                            <ExamTimer :end_time="end_time" />

                        </div>
                        <div v-if="isSubmitted" class="text-lg font-semibold text-slate-800">
                            Score: {{ score }} / {{ data.questions.length }}
                        </div>
                        <Button @click="isSubmitted ? retryExam() : submitAns()"
                            class="px-4 py-4 text-xl text-white transition-all duration-300 transform rounded-full shadow-lg font-semi bg-gradient-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-primary hover:shadow-xl hover:scale-105">
                            {{ isSubmitted ? 'Retry Exam' : 'Submit Exam' }}
                        </Button>
                    </div>
                </div>
            </AppContainer>
            <Progress v-model="progress" class="w-full rounded-none " />
        </header>

        <!-- New summary section -->
        <div v-if="isSubmitted" class="max-w-2xl p-4 mx-auto mt-4 bg-white border rounded-lg shadow">
            <h2 class="mb-4 text-2xl font-semibold text-center">Summary</h2>
            <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
                <div class="p-4 bg-green-100 rounded-lg shadow">
                    <h3 class="mb-2 text-lg font-semibold text-green-700">Correct</h3>
                    <p class="text-2xl font-bold text-green-700">{{ correctCount }}</p>
                </div>
                <div class="p-4 bg-red-100 rounded-lg shadow">
                    <h3 class="mb-2 text-lg font-semibold text-red-700">Wrong</h3>
                    <p class="text-2xl font-bold text-red-700">{{ wrongCount }}</p>
                </div>
                <div class="p-4 bg-gray-100 rounded-lg shadow">
                    <h3 class="mb-2 text-lg font-semibold text-gray-700">Not Answered</h3>
                    <p class="text-2xl font-bold text-gray-700">{{ notAnsweredCount }}</p>
                </div>
                <div class="p-4 bg-orange-100 rounded-lg shadow">
                    <h3 class="mb-2 text-lg font-semibold text-orange-700">Accuracy</h3>
                    <p class="text-2xl font-bold text-orange-700">{{ (correctCount / (correctCount +
                        wrongCount) * 100).toFixed(2) }}%</p>
                </div>
            </div>

            <!-- Subject-based score counts -->
            <div v-if="subjectScores.length > 1" class="mt-6">
                <h3 class="mb-4 text-xl font-semibold text-center">Subject Based Score:</h3>
                <div v-for="subject in subjectScores" :key="subject.name" class="p-4 mb-4 bg-white rounded-lg shadow">
                    <div class="flex justify-between">
                        <span class="text-lg font-semibold">{{ subject.name }}:</span>
                        <span class="text-lg font-semibold">{{ subject.score }} / {{ subject.total }}</span>
                    </div>
                </div>
            </div>
        </div>

        <div class="max-w-2xl py-5 mx-auto space-y-4 md:py-10 md:space-y-6" v-if="status === 'success'">
            <h1 class="text-xl font-bold text-center title_grad md:hidden">{{ data.exam.title }}</h1>
            <div v-for="(q, i) in data.questions" :key="i"
                class="p-3 mx-2 space-y-3 bg-white border rounded-lg shadow-md md:p-6">

                <div class="text-lg font-semibold text-gray-900 " v-html="q.question"></div>

                <div class="flex flex-wrap justify-between gap-3 ">
                    <div class="flex gap-3">
                        <Badge> প্রশ্ন নংঃ {{ formatNumber(i + 1) }}</Badge>
                        <Badge> {{ q.subject.name }}</Badge>
                        <Badge> ১ নম্বর</Badge>

                    </div>
                    <!-- New badge for question status -->
                    <Badge v-if="isSubmitted" class="justify-self-end" :class="{
                        'bg-green-500': isCorrect(q),
                        'bg-red-500': isWrong(q),
                        'bg-gray-500': !q.selected
                    }">
                        {{ getQuestionStatus(q) }}
                    </Badge>
                </div>
                <div class="mt-3 space-y-3 ">

                    <div v-for="(a, j) in q.options" :key="j"
                        class="flex items-center p-3 space-x-2 text-gray-900 transition-colors border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                        :class="{
                        'border-slate-500': !isSubmitted && data.questions[i].selected == a.id,
                        'border-red-500': isSubmitted && data.questions[i].selected == a.id && !a.correct,
                        'border-green-500': isSubmitted && a.correct
                    }" @click="!isSubmitted && selectOption(i, a.id)">


                        <ClientOnly>
                            <div v-katex="a.option_text">
                            </div>
                        </ClientOnly>
                    </div>
                </div>
                <p class="flex items-center mt-4 text-green-600" v-if="q.selected && !isSubmitted">
                    <Icon name="lucide:circle-check" class="w-4 h-4 mr-2" />
                    Answer selected
                </p>
            </div>
        </div>

        <div v-else>
            <AppLoader />
        </div>

        <Dialog :open="showResultDialog" @update:open="showResultDialog = $event">
            <DialogContent class="text-center">

                <div class="py-8">
                    <Icon name="lucide:trophy" class="w-20 h-20 mx-auto text-yellow-400" />
                    <p class="mt-4 text-4xl font-bold text-primary">
                        {{ score }} / {{ data.questions.length }}
                    </p>
                    <p class="mt-2 text-xl text-gray-600">Great job!</p>
                </div>
                <DialogFooter class="flex justify-center space-x-4">
                    <Button @click="retryExam" class="bg-gray-500 hover:bg-gray-600">Retry Exam</Button>
                    <Button @click="showDetails" class=" bg-primary hover:bg-primary-dark">View
                        Details</Button>

                </DialogFooter>
            </DialogContent>
        </Dialog>
    </div>

</template>

<script setup>

definePageMeta({
    layout: 'blank'
})


import { useToast } from '@/components/ui/toast/use-toast'


const route = useRoute()

const { data, status, error, refresh } = await useFetch('/api/question/' + route.params.id + '/practice', {
    key: 'questions'
})


const timer = useLocalStorage('timer', null)

const { toast } = useToast()
const end_time = ref(null)
const isSubmitted = ref(false)
const score = ref(0)
const submitAns = async () => {
    try {
        // Calculate score
        score.value = data.value.questions.filter(q => q.selected).reduce((acc, q) => {
            const ans = q.options.find(o => o.id === q.selected)
            if (ans.correct) {
                return acc + 1
            } else if (ans.correct === false) {
                return acc - 0.25
            }
            return acc
        }, 0)

        clearTimeout(timer.value)
        timer.value = null
        isSubmitted.value = true

        // Show the result dialog instead of toast
        showResultDialog.value = true
    } catch (error) {
        toast({
            title: 'Error',
            variant: 'destructive'
        })
    }
}

const retryExam = () => {
    // Reset the exam state
    data.value.questions.forEach(q => {
        q.selected = null
    })
    score.value = 0
    showResultDialog.value = false
    isSubmitted.value = false
    end_time.value = new Date().getTime() + (data.value.exam.duration * 60 * 1000)

    // Restart the timer
    if (!timer.value) {
        timer.value = setInterval(() => {
            const now = new Date().getTime()
            const distance = end_time.value - now
            if (distance < 0) {
                clearInterval(timer.value)
                timer.value = null
                submitAns()
            }
        }, 1000)
    }
}

const selectOption = (idx, a_id) => {
    if (!isSubmitted.value) {
        data.value.questions[idx].selected = a_id
    }
}

const progress = computed(() => {

    if (status.value !== 'success') return 0
    return data.value.questions.filter(q => q.selected).length / data.value.questions.length * 100
})

const showResultDialog = ref(false)

onMounted(() => {

    end_time.value = new Date().getTime() + (data.value.exam.duration * 60 * 1000)

    if (!timer.value) {
        timer.value = setInterval(() => {
            const now = new Date().getTime()
            const distance = end_time.value - now
            if (distance < 0) {
                clearInterval(timer.value)
                timer.value = null
                submitAns()
            }
        }, 1000)
    }
})

// Add these new functions
const isCorrect = (question) => {
    return question.selected && question.options.find(o => o.id === question.selected)?.correct
}

const isWrong = (question) => {
    return question.selected && !question.options.find(o => o.id === question.selected)?.correct
}

const getQuestionStatus = (question) => {
    if (!question.selected) return 'Not Answered'
    return isCorrect(question) ? 'Correct' : 'Wrong'
}

// Add these new computed properties
const correctCount = computed(() => {
    if (!isSubmitted.value) return 0
    return data.value.questions.filter(q => isCorrect(q)).length
})

const wrongCount = computed(() => {
    if (!isSubmitted.value) return 0
    return data.value.questions.filter(q => isWrong(q)).length
})

const notAnsweredCount = computed(() => {
    if (!isSubmitted.value) return 0
    return data.value.questions.filter(q => !q.selected).length
})

// Add this new computed property
const subjectScores = computed(() => {
    if (!isSubmitted.value || !data.value) return []

    const subjects = {}
    data.value.questions.forEach(q => {
        if (!subjects[q.subject.name]) {
            subjects[q.subject.name] = { correct: 0, total: 0 }
        }
        subjects[q.subject.name].total++
        if (isCorrect(q)) {
            subjects[q.subject.name].correct++
        }
    })

    return Object.entries(subjects).map(([name, scores]) => ({
        name,
        score: scores.correct,
        total: scores.total
    }))
})

const showDetails = () => {
    showResultDialog.value = false

    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    })
}

</script>

<style lang="scss" scoped></style>