<template>
    <div>

        <div class="flex justify-between">
            <AppHeading title="Courses" />

        </div>
        <div v-if="status === 'success'" class="grid md:grid-cols-3">
            <div v-for="c in data.body" :key="c.id">
                <Card class="w-full max-w-md overflow-hidden rounded-lg">
                    <div class="relative h-48 md:h-56 lg:h-64">
                        <NuxtImg :src="c.image" alt="Chemistry Chapter" class="object-cover w-full h-full" width="384"
                            height="256" />

                    </div>
                    <h2 class="text-xl font-semibold text-center">
                        {{ c.name }}
                    </h2>
                    <div class="flex justify-center gap-3 mb-3 text-center">
                        <p class="hidden text-lg font-semibold text-red-500 line-through">
                            Tk. {{ c.regular_price }}
                        </p>
                        <p class="text-lg font-semibold">
                            Tk. {{ c.sale_price }}
                        </p>

                    </div>
                </Card>
            </div>
        </div>
    </div>
    <CourseModal />
</template>

<script setup>

definePageMeta({
    layout: 'admin',
})


const { data, status, error } = await useFetch('/api/admin/courses', {
    key: 'courses',
})




const { onOpen } = useCourse()


</script>

<style lang="scss" scoped></style>