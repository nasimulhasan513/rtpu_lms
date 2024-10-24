<template>
    <AppContainer v-if="status === 'success'">
        <div
            class="max-w-3xl p-8 mx-auto my-12 transition-all duration-300 bg-white border border-blue-200 shadow-lg dark:bg-gray-800 dark:border-gray-700 rounded-2xl hover:shadow-xl">
            <div class="space-y-8">
                <div class="p-4 space-y-2 border rounded-lg bg-amber-50 dark:bg-amber-900 border-amber-200 dark:border-amber-700">
                    <div class="flex items-center space-x-3 text-amber-700 dark:text-amber-300">
                        <Icon name="lucide:info" class="flex-shrink-0 w-6 h-6" />
                        <p class="text-sm font-medium">
                            একবার এক্সাম দিতে ঢুকলেই তোমার সময় শুরু হয়ে যাবে। ভুলে, নেটের সমস্যায় বা অন্য যেকোনো কারণে এক্সাম থেকে বের হয়ে গেলে অটমেটিক্যালি এক্সাম সাবমিট হয়ে যাবে। তাই পরিপূর্ণ প্রস্তুতি নিয়ে পরীক্ষা শুরু করবে।
                        </p>
                    </div>
                </div>

                <div class="space-y-4 text-center">
                    <h1 class="text-4xl font-bold text-blue-500 dark:text-blue-300">
                        {{ data.exam.title }}
                    </h1>
                    
                    <p class="text-sm text-muted-foreground">
                        {{ data.exam.description }}
                    </p>
                </div>

                <div class="grid max-w-md grid-cols-2 gap-4 mx-auto">
                    <ExamInfoBox icon="lucide:clock" label="Duration" :value="`${data.exam.duration} minutes`"
                    color="text-green-500" />
                <ExamInfoBox icon="lucide:award" label="Total Marks"
                    :value="`${data.exam.totalMarks} x 1 = ${data.exam.totalMarks} ${data.exam.negativeMarking ? '(-0.25/wrong answer)' : ''}`" color="text-yellow-500" />
           
                </div>

                <div class="flex justify-center">
                    <Button @click="navigateTo(`/${route.params.shop}/${route.params.slug}/mcq/${route.params.id}`)"
                        class="px-8 py-4 text-xl font-bold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-teal-500 to-blue-600 hover:from-blue-600 hover:to-primary hover:shadow-xl hover:scale-105">
                        Start Exam
                    </Button>
                </div>
            </div>
        </div>
    </AppContainer>
    <div v-else class="flex flex-col items-center justify-center w-full h-screen">
        <AppLoader />
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'blank'
})

const route = useRoute()
const { data, status, error, refresh } = await useFetch('/api/courses/' + route.params.slug + '/exams/' + route.params.id, {

})


</script>

<style lang="scss" scoped></style>