<template>
    <AppContainer>

        <div v-if="status === 'success'" class="space-y-6">

            <div class="max-w-2xl mx-auto space-y-5">
                <ExamCard v-for="exam in data.body.ongoingExams" :key="exam.id" :exam="exam" />
            </div>
            <Tabs default-value="upcoming">
                <TabsList class="grid w-full grid-cols-2 border">
                    <TabsTrigger value="upcoming">
                        পরবর্তী পরীক্ষাসমূহ
                    </TabsTrigger>
                    <TabsTrigger value="past">
                        পূর্ববর্তী পরীক্ষাসমূহ
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="upcoming">
                    <div v-if="data.body.upcomingExams.length > 0" class="grid gap-6 lg:grid-cols-2">
                        <ExamCard v-for="exam in data.body.upcomingExams" :key="exam.id" :exam="exam" />
                    </div>

                    <AppEmptyState v-else title="কোন পরীক্ষা নির্ধারিত নেই" subtitle="পরবর্তী পরীক্ষাসমূহ" />


                </TabsContent>
                <TabsContent value="past">
                    <div v-if="data.body.pastExams.length > 0" class="grid gap-6 lg:grid-cols-2">
                        <ExamCard v-for="exam in data.body.pastExams" :key="exam.id" :exam="exam" />
                    </div>
                    <AppEmptyState v-else title="কোন পরীক্ষা নির্ধারিত নেই" subtitle="পূর্ববর্তী পরীক্ষাসমূহ" />

                </TabsContent>
            </Tabs>

        </div>
        <div v-else class="py-8">
            <AppLoader />
        </div>

    </AppContainer>
</template>

<script setup>
definePageMeta({
    layout: 'course',
    middleware: 'enrolled'
})

const route = useRoute()

const { data, status, error, refresh } = await useLazyFetch(`/api/courses/${route.params.slug}/exams`, {
    key: 'course-exams',
})




</script>

<style lang="scss" scoped></style>