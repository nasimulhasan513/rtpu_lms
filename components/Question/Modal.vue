<template>


    <AppModal size="sm:min-w-3xl" :isOpen="isOpen" title="Question Management"
        description="Create and update question for an exam" @onClose="onClose" v-if="isOpen">

        <form @submit.prevent="onSubmit">
            <div class="space-y-6">
                <div class="grid grid-cols-2 gap-6">
                    <!-- select -->

                    <Select v-model="model.subjectId">

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


                    <Select v-model="model.chapterId">

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
            </div>
            <div class="flex flex-wrap my-6 -mx-3">
                <div class="w-full px-3 mb-6 md:mb-0">
                    <div class="flex items-center justify-between">
                        <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                            for="grid-question">Question</label>
                        <div class="inline-flex items-center space-x-2">
                            <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                                for="grid-question">Rich Text</label>
                            <input type="checkbox" class="-mt-2 checkbox checkbox-primary" v-model="richText.question">
                        </div>

                    </div>
                    <Textarea v-if="!richText.question" v-model="model.question" placeholder="Question">
                        </Textarea>
                    <div v-else>
                        <QuillEditor v-model:content="model.question" contentType="html" :options="editorOptions" />
                    </div>
                </div>
            </div>

            <Tabs default-value="text">
                <TabsList class="grid w-full grid-cols-2">
                    <TabsTrigger value="text">
                        Text Based
                    </TabsTrigger>
                    <TabsTrigger value="easy">
                        Option Based
                    </TabsTrigger>

                </TabsList>
                <TabsContent value="easy">

                    <div class="grid gap-6 my-6">
                        <div v-for="labels, key in optionLabels" :key="key" class="grid grid-cols-4 gap-4">
                            <Button v-for="l, j in labels" :key="j" @click.prevent="setOptions(key, l)"
                                :variant="model.options[j].correct && model.options[j].option_text === l ? '' : 'outline'">
                                {{ l }}
                            </Button>
                        </div>
                    </div>


                </TabsContent>
                <TabsContent value="text">
                    <div class="space-y-3">
                        <template v-for="(s, i) in ['a', 'b', 'c', 'd']" :key="i">

                            <div class="w-full p-1 space-y-2">
                                <div class="flex items-center justify-between">

                                    <div class="flex gap-2">
                                        <Checkbox @update:checked="model.options[i].correct = !model.options[i].correct"
                                            :checked="model.options[i].correct" />
                                        <label
                                            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                                            for="grid-question">Option {{ s.toUpperCase() }}</label>
                                    </div>

                                    <div class="flex gap-2">
                                        <Checkbox @update:checked="richText[s] = !richText[s]" />
                                        <label
                                            class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase"
                                            for="grid-question">Rich Text</label>
                                    </div>

                                </div>
                                <Input v-if="!richText[s]" v-model="model.options[i].option_text"
                                    placeholder="Answer" />
                                <div v-else>
                                    <QuillEditor v-model:content="model.options[i].option_text" contentType="html"
                                        :options="editorOptions" />
                                </div>
                            </div>
                        </template>
                    </div>
                </TabsContent>
            </Tabs>


            <div>
                <Label>
                    Explanation
                </Label>
                <QuillEditor v-model:content="model.explain" contentType="html" :options="editorOptions" />
            </div>



            <div class="flex justify-center gap-3 py-2 my-3 text-center">


                <AppButton :loading="loading" @click="onSubmit" label="Save MCQ" :loadingLabel="'Please wait...'" />

            </div>
        </form>

    </AppModal>

</template>

<script setup>
import { questionSchema } from '@/schema/question.schema'
import '@vueup/vue-quill/dist/vue-quill.snow.css';
import { useToast } from '@/components/ui/toast/use-toast'
import { z } from 'zod'

const props = defineProps({

    label: {
        type: String,
        default: 'Create MCQ'
    },
    isEdit: {
        type: Boolean,
        default: false
    }
})

if (!import.meta.server) {
    const { QuillEditor } = await import('@vueup/vue-quill');
    const { vueApp } = useNuxtApp();
    vueApp.component('QuillEditor', QuillEditor);
}

const { onClose, isOpen, initialQuestion, examId } = useQuestion()


const optionLabels = {
    'en': ['A', 'B', 'C', 'D',],
    'bn': ['ক', 'খ', 'গ', 'ঘ',],
    'mul': ['i, ii', 'ii, iii', 'i, iii', 'i, ii, iii']
}
const { subjects } = useSubject()

const chapters = ref([])


const model = ref(
    initialQuestion.value ? {
        question: initialQuestion.value.question,
        options: initialQuestion.value.options.map(o => ({ option_text: o.option_text, correct: o.correct })),
        subjectId: initialQuestion.value.subjectId,
        chapterId: initialQuestion.value.chapterId,
        difficulty: initialQuestion.value.difficulty || 'Medium',
        explain: initialQuestion.value.explain
    } : {
        question: '',
        examId: examId.value,
        options: [
            { option_text: '', correct: false },
            { option_text: '', correct: false },
            { option_text: '', correct: false },
            { option_text: '', correct: false },
        ],
        subjectId: '',
        chapterId: '',
        difficulty: 'Medium',
        explain: ''
    })
const richText = ref({
    question: true,
    a: false,
    b: false,
    c: false,
    d: false,
    set: '',
    explain: ''
})

const emits = defineEmits(['close'])
const loading = ref(false)

const { toast } = useToast()
const isEdit = ref(false)



const onSubmit = async () => {
    loading.value = true

    try {
        const validatedData = questionSchema.parse(model.value)

        if (isEdit.value) {
            const data = await $fetch(`/api/admin/questions/${model.value.id}`, {
                method: 'PUT',
                body: validatedData
            })

            toast({
                title: "Question updated successfully"
            })
        } else {
            const data = await $fetch('/api/admin/questions', {
                method: 'POST',
                body: validatedData
            })

            if (data.statusCode === 201) {
                toast({
                    title: "Question created successfully"
                })
            }
        }

        refreshNuxtData('exam-questions')
        reset()
        onClose()
    } catch (error) {
        console.log(error)
        if (error instanceof z.ZodError) {
            toast({
                title: "Validation Error",
                description: error.errors[0].message
            })
        } else {
            console.error(error)
            toast({
                title: "Something went wrong",
                description: error.response?.data?.message || "An unexpected error occurred"
            })
        }
    } finally {
        loading.value = false
    }
}


watch(() => initialQuestion.value, (value) => {
    if (value) {
        isEdit.value = true
        model.value = {
            id: value.id,
            question: value.question,
            options: value.options.map(o => ({ ...o, option_text: o.option_text, correct: o.correct })),
            subjectId: value.subjectId,
            chapterId: value.chapterId,
            difficulty: value.difficulty || 'Medium',
            explain: value.explain
        }
    } else {
        isEdit.value = false
    }
})


const reset = () => {
    model.value = {
        question: '',
        options: [
            { option_text: '', correct: false },
            { option_text: '', correct: false },
            { option_text: '', correct: false },
            { option_text: '', correct: false }
        ],
        examId: examId.value,
        subjectId: '',
        chapterId: '',
        difficulty: 'Medium',
        explain: ''
    }
}


const setOptions = (lang, val) => {

    model.value.options = model.value.options.map((o, i) => {

        let option_text = optionLabels[lang][i] ?? null
        let correct = val == option_text

        return {
            ...o,
            option_text, correct,
            type: option_text ? 'update' : 'delete'
        }
    })



}



watch(model.value, (value) => {
    if (value.subjectId) {
        chapters.value = subjects.value.find(s => s.id === value.subjectId).chapters
    }
}, {
    deep: true
})



watch(examId, (value) => {
    model.value.examId = value
})

</script>

<style lang="scss" scoped></style>