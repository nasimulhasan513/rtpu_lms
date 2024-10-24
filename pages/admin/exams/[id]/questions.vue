<template>
    <div>

        <div class="flex justify-between print:hidden">
            <h1 class="text-2xl font-semibold">Questions</h1>
            <div class="flex gap-2">
                <Button @click="saveQuestionOrder(true)" :disabled="orderChanged" variant="outline">
                    <Icon name="lucide:save" class="mr-2" />
                    Save Serial
                </Button>
                <QuestionImport :examId="route.params.id" />
                <Button @click="onOpen(route.params.id)">
                    <Icon name="bx:bx-plus" />
                    Add Question
                </Button>
            </div>
        </div>



        <div v-if="status === 'success'" class="mt-5">

            <div v-if="data.body.length > 0" class="space-y-5 ">
                <div>
                    <p>
                        <span class="font-semibold">{{ data.body.length }}</span> questions found
                    </p>
                </div>
                <draggable handle=".handle" v-model="questions" item-key="id" @end="saveQuestionOrder"
                    class="space-y-5">
                    <template #item="{ element: q, index }">
                        <div class="p-5 bg-white border rounded-2xl">
                            <div class="flex items-center justify-between">
                                <div class="inline-block space-x-3">
                                    <button
                                        class="inline-flex items-center justify-center w-8 h-8 border rounded-md handle">

                                        <Icon name="lucide:grip-vertical" />

                                    </button>
                                    <Badge color="amber">
                                        Q. {{ index + 1 }}
                                    </Badge>
                                    <Badge  class="bg-red-500 print:hidden">
                                        Serial: <input v-model="questions[index].serial" type="number" class="w-10 px-1 bg-transparent border-b border-red-300 focus:outline-none focus:border-red-500" @change="updateSerial(q)" />
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
                                    <Badge class="bg-orange-500 print:hidden">
                                        {{ formatDate(q.createdAt) }}
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
                    </template>
                </draggable>

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
import draggable from 'vuedraggable'
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

const { fetchSubjects } = useSubject()
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

const questions = ref([])
const orderChanged = ref(false)

watch(() => data.value, () => {
    if (data.value && data.value.body) {
        questions.value = [...data.value.body].sort((a, b) => a.serial - b.serial)
    }
}, { immediate: true })

const saveQuestionOrder = async (fromdata = false) => {
    try {
        
        let updatedQuestions =[]
        
        if(fromdata){
            updatedQuestions =questions.value.map((q) => ({
                id: q.id,
                serial: q.serial
            }))
        }else{
            updatedQuestions = questions.value.map((q, index) => ({
            id: q.id,
            serial: index + 1,
        }))
        }
        
       

        await $fetch('/api/admin/questions', {
            method: 'PATCH',
            body: updatedQuestions,
        })

        orderChanged.value = false

        toast({
            title: 'Question order updated successfully'
        })

        refresh()


    } catch (error) {
        console.error('Error updating question order:', error)
        toast({
            title: 'Failed to update question order'
        })
    }
}

onMounted(() => {
    fetchSubjects()
})





</script>

<style lang="scss" scoped></style>