<template>



    <div class="max-w-2xl py-5 mx-auto space-y-3" v-if="status === 'success'">
        
        <div>

            <h2 class="text-2xl font-semibold text-center ">
                {{ data.exam.title }}
            </h2>

        </div>



        <div v-if="data.exam && data.exam.totalMarks > 0 && data.submission">
            <ExamSolutionChart :correct="data.exam.correct" :wrong="data.exam.wrong" :skipped="data.exam.skipped"
                :total="data.exam.totalMarks" :subjectWiseMarks="subjectWiseMarks" />

        </div>



        <div v-for="(q, i) in data.questions" :key="i" class="p-6 space-y-3 bg-white border rounded-lg shadow-md">

            <div class="text-lg font-semibold text-gray-900 " v-html="q.question"></div>

            <div class="flex justify-between ">
                <div class="flex flex-wrap gap-3 ">
                    <Badge> প্রশ্ন নংঃ {{ formatNumber(i + 1) }}</Badge>
                    <Badge> {{ q.subject.name }}</Badge>

                </div>
                <Badge class="bg-orange-500" v-if="notAnswered(q.id)">উত্তর করা হয়নি</Badge>
                <Badge class="bg-red-500" v-else-if="isWrongAnswer(q)"> ভুল উত্তর </Badge>
                <Badge class="bg-green-500" v-else-if="isCorrectAnswer(q)"> সঠিক উত্তর </Badge>
            </div>
            <div class="mt-3 space-y-3 ">

                <div v-for="(a, j) in q.options" :key="j"
                    class="relative flex items-center p-3 space-x-2 text-gray-900 transition-colors border-2 border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50"
                    :class="{ 'border-green-500': a.correct, 'border-red-500': wrongAnswer(a.id) && !a.correct }">
                    <Icon name="lucide:check-circle-2" size="24" class="absolute text-green-500 right-3"
                        v-if="a.correct" />
                    <Icon name="lucide:check-circle-2" size="24" class="absolute text-green-500 right-3"
                        v-if="a.correct" />
                    <Icon name="lucide:circle-x" size="24" class="absolute text-red-500 right-3"
                        v-if="wrongAnswer(a.id) && !a.correct" />
                    <ClientOnly>
                        <div v-katex="a.option_text">
                        </div>
                    </ClientOnly>
                </div>
            </div>

            <AppMath v-if="q.explain" v-model="q.explain" class="p-2 border border-green-600 rounded-md">
            </AppMath>

        </div>
    </div>

    <div v-else>
        <AppLoader />
    </div>

</template>

<script setup>

definePageMeta({
    layout: 'course'
})

const route = useRoute()
const { data, status, error, refresh } = await useFetch('/api/question/' + route.params.id + '/solution', {
    key: 'solution'
})



const isWrongAnswer = (q) => {

    if (!data.value.submission) return false

    const wrong = data.value.submission.find(s => s.q == q.id)

    if (!wrong) return false

    const option = q.options.find(o => o.id == wrong.a)
    return option && !option.correct
}

const isCorrectAnswer = (q) => {

    if (!data.value.submission) return false

    const correct = data.value.submission.find(s => s.q == q.id)

    if (!correct) return false

    const option = q.options.find(o => o.id == correct.a)
    return option && option.correct
}

// Existing functions
const wrongAnswer = (o) => {
    // if exists
    return data.value.submission.find(s => s.a == o)
}

const notAnswered = (o) => {
    if (!data.value.submission) return false
    // if exists
    return !(data.value.submission.find(s => s.q == o)) && data.value.submission
}


const subjectWiseMarks = computed(() => {
    const subjectMarks = {}
    data.value.questions.forEach(q => {
        const subject = q.subject.name
        if (!subjectMarks[subject]) {
            subjectMarks[subject] = 0
        }
        if (isCorrectAnswer(q)) {
            subjectMarks[subject] += 1
        }
        if (isWrongAnswer(q)) {
            subjectMarks[subject] -= 0.25
        }
    })

    return subjectMarks
})


</script>

<style lang="scss" scoped></style>