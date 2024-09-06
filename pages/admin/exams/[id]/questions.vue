<template>
    <div>

        <div class="flex justify-between print:hidden">
            <h1 class="text-2xl font-semibold">Questions</h1>
            <Button @click="onOpen(route.params.id)">
                <Icon name="bx:bx-plus" />
                Add Question
            </Button>
        </div>



        <div v-if="status === 'success'" class="mt-5 space-y-5">

            <div v-if="data.body.length > 0">
                <div>
                    <p>
                        <span class="font-semibold">{{ data.body.length }}</span> questions found
                    </p>
                </div>
                <div v-for="(q, j) in data.body" :key="q.id" class="p-5 bg-white border rounded-2xl">
                    <div class="flex items-center justify-between">
                        <div class="inline-block space-x-3">
                            <Badge color="amber">
                                Q. {{ j + 1 }}
                            </Badge>
                            <Badge v-if="q.serial" class="bg-red-500 print:hidden">
                                Serial: {{ q.serial }}
                            </Badge>
                            <Badge class="bg-blue-500">
                                {{ q.subject.name }}
                            </Badge>
                            <Badge v-if="q.chapter" class="bg-blue-500">
                                {{ q.chapter?.name }}
                            </Badge>
                            <Badge class="bg-orange-500 print:hidden">
                                {{ q.creator?.name }}
                            </Badge>
                        </div>
                        <div class="flex items-center gap-3 mt-3 print:hidden">
                            <Button @click="onEdit(q)" variant="outline">
                                <Icon name="bx:bx-edit" class="mr-2" />
                                Edit
                            </Button>
                            <Button @click="deleteMCQ(q.id)" variant="destructive">
                                <Icon name="lucide:trash" class="mr-2" />
                                Delete
                            </Button>
                        </div>
                    </div>
                    <div class="mt-3 text-lg font-semibold" v-html="q.question"></div>
                    <div class="grid gap-3 mt-4">
                        <div v-for="(a, k) in q.options" :key="k">
                            <div class="flex gap-3 p-2 border rounded-lg">
                                <Badge variant="secondary" :class="{ 'bg-green-500 text-white': a.correct }">
                                    {{ k + 1 }}
                                </Badge>
                                <div v-html="a.option_text"></div>
                            </div>
                        </div>
                    </div>
                    <div v-if="q.explain">
                        <div class="mt-3 text-lg font-semibold">Explanation</div>
                        <AppMath v-model="q.explain"></AppMath>
                    </div>
                </div>
            </div>
            <div v-else>
                <p>No questions found</p>
            </div>
        </div>
        <div v-else>
            <AppLoader />
        </div>

    </div>

    <ClientOnly>
        <QuestionModal />

    </ClientOnly>
</template>

<script setup>
// import katex from 'katex'
import { useToast } from '@/components/ui/toast/use-toast'
definePageMeta({
    title: 'Questions',
    layout: 'admin',
    middleware: 'admin'
})



const route = useRoute()
const { data, status, error, refresh } = await useLazyFetch('/api/admin/exams/' + route.params.id + '/questions', {
    key: 'exam-questions',
})

const { fetchSubjects, subjects } = useSubject()
const { onOpen, onEdit } = useQuestion()

const { toast } = useToast()

const deleteMCQ = async (id) => {
    const res = await $fetch('/api/admin/questions/' + id, {
        method: 'DELETE'
    })

    toast({
        title: "Question deleted successfully"
    })
    // refresh()

    data.value = {
        body: {
            questions: data.value.body.questions.filter(q => q.id !== id)
        }
    }

}

onMounted(() => {
    fetchSubjects()
})



</script>

<style lang="scss" scoped></style>