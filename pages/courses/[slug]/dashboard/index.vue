<template>

    <div v-if="dashboardData">

        <!-- Progress Overview -->
        <div class="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
            <ProgressCard title="Lessons" :progress="dashboardData.progress.lessons" />
            <ProgressCard title="Exams" :progress="dashboardData.progress.exams" />
            <ProgressCard title="Assignments" :progress="dashboardData.progress.assignments" />
        </div>

        <!-- Lessons -->
        <div class="mb-12">
            <h2 class="mb-4 text-2xl font-semibold">Subjects</h2>
            <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <SubjectThumbnail v-for="subject in dashboardData.subjects" :key="subject.id" :name="subject.name"
                    :total-lessons="subject.totalLessons" :id="subject.id" />
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
    layout: 'course'
})


const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const { data: dashboardData, error } = await useFetch(`/api/courses/${route.params.slug}/dashboard`)

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

const goToExam = (examId) => {
    router.push(`/courses/${route.params.slug}/exams/${examId}`)
}
</script>