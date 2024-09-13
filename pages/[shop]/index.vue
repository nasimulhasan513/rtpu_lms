<template>
    <div class="min-h-[76vh] bg-background">
        <AppContainer>

            <div v-if="status === 'success'">
                <div class="flex items-center justify-center pt-10">
                    <AppHeading :title="data.platformName" :subtitle="data.name" :center="true" />

                </div>
                <div v-if="data.courses.length > 0">

                    <HomeFeaturedCourses :courses="data.courses" :category="data.slug" />
                </div>
                <div v-else class="py-12 text-center">
                    <h2 class="mb-4 text-2xl font-semibold">কোনো কোর্স পাওয়া যায়নি</h2>
                    <p class="text-muted-foreground">এই ক্যাটাগরিতে কোর্স পাওয়া যায়নি।</p>
                </div>
            </div>
            <div v-else-if="status === 'error'" class="py-12 text-center">
                <p class="text-red-500">কোর্স লোডিং তে একটি ত্রুটি ঘটেছে। দুঃখিত, আমরা এটি পুনরায় পরিশোধ করার চেষ্টা
                    করব।</p>
            </div>
            <div v-else class="py-12 text-center">
                <p class="text-muted-foreground">কোর্স লোডিং...</p>
            </div>
        </AppContainer>
    </div>
</template>

<script setup>
const route = useRoute()

const { data, status, refresh } = useFetch(`/api/category/${route.params.shop}`)
</script>

<style lang="scss" scoped></style>