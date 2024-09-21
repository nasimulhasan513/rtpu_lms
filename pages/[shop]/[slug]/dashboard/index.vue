<template>

    <div v-if="dashboardData" class="flex flex-col-reverse gap-3 md:flex-col">

        <!-- Progress Overview -->
        <div class="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
            <ProgressCard title="ক্লাস সমূহ" :progress="dashboardData.progress.lessons" />
            <ProgressCard title="বহুনির্বাচনী পরীক্ষা" :progress="dashboardData.progress.exams" />
            <ProgressCard title="লিখিত পরীক্ষা" :progress="dashboardData.progress.assignments" />
        </div>

        <!-- Lessons -->
        <div class="mb-12" v-if="dashboardData.subjects.length > 0">
            <h2 class="mb-4 text-2xl font-semibold">
                ক্লাস সমূহ
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <LessonSubjectThumbnail v-for="subject in dashboardData.subjects" :key="subject.id" :subject="subject"
                    @click="goToSubject(subject.id)" />
            </div>
        </div>

        <div v-if="dashboardData.exams.length > 0">
            <h2 class="mb-4 text-2xl font-semibold">
                পরীক্ষাসমূহ
            </h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">

                <div v-for="exam in dashboardData.exams" :key="exam.id"
                    class="p-6 space-y-3 bg-white border rounded-lg shadow-md cursor-pointer"
                    @click="navigateTo(`/${route.params.shop}/${route.params.slug}/mcq`)">
                    <h3 class="text-lg font-semibold text-gray-900">{{ exam.title }}</h3>
                    <Badge :class="statusLabel[exam.status].color">{{ statusLabel[exam.status].label }}</Badge>
                </div>

            </div>
        </div>

    </div>
    <div v-else-if="error" class="text-center text-red-500">
        {{ error }}
    </div>
    <div v-else class="text-center">
        <p>ড্যাশবোর্ড ডেটা লোড হচ্ছে...</p>
    </div>



</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
    layout: 'course',
    middleware: 'enrolled'
})


const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const nuxtApp = useNuxtApp()

const { data: dashboardData, error } = useFetch(`/api/courses/${route.params.slug}/dashboard`, {
    getCachedData(key) {
        return nuxtApp.payload.data[key] || nuxtApp.static.data[key]
    }
})

// const { fetchCourse } = useCourse()
// onMounted(async () => {
//     await fetchCourse(route.params.slug)
// })

if (error.value) {
    toast({
        title: 'Error',
        description: 'Failed to load dashboard data. Please try again later.',
        variant: 'destructive'
    })
}



const goToSubject = (subjectId) => {
    router.push(`/${route.params.shop}/${route.params.slug}/lessons?subjectId=${subjectId}`)
}


const statusLabel = {
    upcoming: {
        label: 'পরবর্তী',
        color: 'bg-blue-500'
    },
    ongoing: {
        label: 'চলমান',
        color: 'bg-red-500 hover:bg-red-600'
    },
    past: {
        label: 'পূর্ববর্তী',
        color: 'bg-red-500'
    }
}



</script>