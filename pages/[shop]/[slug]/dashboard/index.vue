<template>

    <div v-if="dashboardData">

        <!-- Progress Overview -->
        <div class="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
            <ProgressCard title="ক্লাস সমূহ" :progress="dashboardData.progress.lessons" />
            <ProgressCard title="বহুনির্বাচনী পরীক্ষা" :progress="dashboardData.progress.exams" />
            <ProgressCard title="লিখিত পরীক্ষা" :progress="dashboardData.progress.assignments" />
        </div>

        <!-- Lessons -->
        <div class="mb-12">
            <h2 class="mb-4 text-2xl font-semibold">বিষয়সমূহ</h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <LessonSubjectThumbnail v-for="subject in dashboardData.subjects" :key="subject.id" :subject="subject"
                    @click="goToSubject(subject.id)" />
            </div>
        </div>

    </div>
    <div v-else-if="error" class="text-center text-red-500">
        {{ error }}
    </div>
    <div v-else class="text-center">
        <p>Loading dashboard data...</p>
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

const { data: dashboardData, error } = useFetch(`/api/courses/${route.params.slug}/dashboard`)

const { fetchCourse } = useCourse()
onMounted(async () => {
    await fetchCourse(route.params.slug)
})

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


</script>