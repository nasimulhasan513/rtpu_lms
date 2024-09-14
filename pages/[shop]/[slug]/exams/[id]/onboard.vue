<template>
    <AppContainer v-if="status === 'success'">
        <div
            class="max-w-3xl p-8 mx-auto my-12 transition-all duration-300 bg-white border border-blue-200 shadow-lg rounded-2xl hover:shadow-xl">
            <div class="space-y-8">
                <div class="p-4 space-y-2 border rounded-lg bg-amber-50 border-amber-200">
                    <div class="flex items-center space-x-3 text-amber-700">
                        <Icon name="lucide:info" class="flex-shrink-0 w-6 h-6" />
                        <p class="text-sm font-medium">
                            একবার এক্সাম দিতে ঢুকলেই তোমার সময় শুরু হয়ে যাবে। ভুলে বা নেটের সমস্যায় বা
                            অন্য যেকোনো কারণে একাধিকবার এক্সাম দেয়ার চেষ্টা করলে র‍্যাংকিং এ তোমার নাম
                            সবার নিচে চলে যাবে।
                        </p>
                    </div>
                </div>

                <div class="space-y-4 text-center">
                    <h1 class="text-4xl font-bold text-blue-500">
                        {{ data.exam.title }}
                    </h1>
                    <div class="flex items-center justify-center space-x-2 ">
                        <Icon name="lucide:clock" class="w-6 h-6" />
                        <h2 class="text-xl font-semibold">
                            এক্সাম শুরু হবে:
                        </h2>
                    </div>
                    <p class="text-2xl font-medium text-muted-foreground">
                        {{ formatDate(data.exam.startTime) }}
                    </p>
                </div>

                <div class="flex justify-center">
                    <Button @click="navigateTo(`/${route.params.shop}/${route.params.slug}/exams/${route.params.id}`)"
                        class="px-8 py-4 text-xl font-bold text-white transition-all duration-300 transform rounded-full shadow-lg bg-gradient-to-r from-primary to-blue-600 hover:from-blue-600 hover:to-primary hover:shadow-xl hover:scale-105">
                        শুরু করুন
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