<template>
    <div>

        <Button @click="isOpen = true" variant="outline">
            <Icon name="bx:bx-plus" />
            Import Questions
        </Button>

        <AppModal :isOpen="isOpen" size="sm:min-w-3xl" title="Import Questions" @onClose="onClose">
            <div class="flex gap-2">
                <Input type="text" v-model="url" placeholder="Enter the URL of the questions" />
                <AppButton @click="fetchQuestions" :loading="loading" label="Load Questions" />
                <Button @click="sampleQuestions" variant="destructive">
                    <Icon name="lucide:sheet" class="mr-2" />
                    Sample
                </Button>
            </div>
            <div class="grid grid-cols-2 gap-6">

                <!-- Subject Select -->
                <Select v-model="subjectId">
                    <SelectTrigger>
                        <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup v-for="s in subjects" :key="s.id">
                            <SelectItem :value="s.id">
                                {{ s.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>

                <!-- Chapter Select -->
                <Select v-model="chapterId">
                    <SelectTrigger>
                        <SelectValue placeholder="Select chapter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup v-for="c in chapters" :key="c.id">
                            <SelectItem :value="c.id">
                                {{ c.name }}
                            </SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
            <div>
                <div class="flex justify-between">
                    <h1>Questions
                        <span class="text-sm text-gray-500">({{ questions.length }})</span>
                    </h1>
                    <div class="flex gap-2">
                        <AppButton @click="importQuestions" :loading="importloading" label="Import"
                            icon="lucide:download" />

                    </div>
                </div>

                <div v-if="questions.length > 0">
                    <div v-for="q, i in questions" :key="i">
                        <div class="mt-3 text-lg font-semibold" v-html="q.question"></div>
                        <div class="grid gap-3 mt-4">
                            <div v-for="(a, k) in ['a', 'b', 'c', 'd']" :key="k">
                                <div class="flex gap-3 p-2 border rounded-lg">
                                    <Badge variant="secondary"
                                        :class="{ 'bg-green-500 text-white': q[a] == q.correct }">
                                        {{ k + 1 }}
                                    </Badge>
                                    <div v-html="q[a]"></div>
                                </div>
                            </div>
                        </div>
                    </div>


                </div>
                <div v-else>
                    <p>No questions found</p>
                </div>
            </div>
        </AppModal>

    </div>
</template>

<script setup>
import { questionSchema } from '@/schema/question.schema';
import { useToast } from '@/components/ui/toast';

const { toast } = useToast()
const props = defineProps({
    examId: {
        type: String,
        required: true
    }
})
const subjectId = ref('')
const chapterId = ref('')
const chapters = ref([])
const { subjects } = useSubject()
const isOpen = ref(false)

const onClose = () => {
    isOpen.value = false
}

const url = ref('')
const questions = ref([])
const loading = ref(false)

const fetchQuestions = async () => {

    if (!url.value) {
        return
    }

    loading.value = true

    try {
        const sheetId = url.value.split('/')[5]

        const baseURL = `https://script.google.com/macros/s/AKfycbwzA-t_cUmiQpA7ArN8OEl_LBeu-JM9VgjrX3x0Camq-lsSt2Gd0xPZ3flPFyBipAQkJw/exec?type=question&sheet=${sheetId}`
        const res = await fetch(baseURL)
        const data = await res.json()
        questions.value = data
    } catch (error) {
        console.log(error)
    } finally {
        loading.value = false
    }
}

const importloading = ref(false)
const importQuestions = async () => {
    if (!subjectId.value || !chapterId.value) {
        toast({ title: 'Please select subject and chapter', variant: 'destructive' })
        return
    }
    try {
        importloading.value = true

        await Promise.all(questions.value.map(async (q, sl) => {
            const question = {
                question: q.question,
                options: [
                    { option_text: q.a, correct: q.a == q.correct },
                    { option_text: q.b, correct: q.b == q.correct },
                    { option_text: q.c, correct: q.c == q.correct },
                    { option_text: q.d, correct: q.d == q.correct },
                ],
                explain: q.explain,
                serial: sl + 1,
                examId: props.examId,
                subjectId: subjectId.value,
                chapterId: chapterId.value,
                difficulty: "Medium",
            }
            const validatedData = questionSchema.parse(question);
            await $fetch('/api/admin/questions', { method: 'POST', body: validatedData });
        }))


        refreshNuxtData('exam-questions')
        onClose()

    } catch (error) {
        console.log(error)
    } finally {
        importloading.value = false
    }



}

const sampleQuestions = () => {
    window.open('https://docs.google.com/spreadsheets/d/1CH-DssTBoaztz3sBIGQg2n7-SqopNRk8yBjBFqLzk9Q/edit?usp=sharing', '_blank')
}
watch(() => subjectId.value, (subjectId) => {
    if (subjectId) {
        const selectedSubject = subjects.value.find((s) => s.id === subjectId);
        chapters.value = selectedSubject ? selectedSubject.chapters : [];
    }
});


</script>

<style lang="scss" scoped></style>