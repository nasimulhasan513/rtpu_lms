<template>
    <AppContainer>
        <div v-if="dashboardData" class="container px-4 py-8 mx-auto">
            <h1 class="mb-8 text-3xl font-bold">{{ dashboardData.course.name }} Dashboard</h1>

            <!-- Progress Overview -->
            <div class="grid grid-cols-1 gap-6 mb-12 md:grid-cols-3">
                <ProgressCard title="Lessons" :progress="dashboardData.progress.lessons" />
                <ProgressCard title="Exams" :progress="dashboardData.progress.exams" />
                <ProgressCard title="Assignments" :progress="dashboardData.progress.assignments" />
            </div>

            <!-- Lessons -->
            <div class="mb-12">
                <h2 class="mb-4 text-2xl font-semibold">Lessons</h2>
                <ul class="space-y-2">
                    <li v-for="lesson in dashboardData.lessons" :key="lesson.id" class="flex items-center">
                        <Icon name="mdi:play-circle" class="w-5 h-5 mr-2 text-primary" />
                        <NuxtLink :to="`/courses/${dashboardData.course.slug}/lessons/${lesson.id}`"
                            class="hover:underline">
                            {{ lesson.title }}
                        </NuxtLink>
                    </li>
                </ul>
            </div>

            <!-- Exams -->
            <div>
                <h2 class="mb-4 text-2xl font-semibold">Exams</h2>
                <ul class="space-y-4">
                    <li v-for="exam in dashboardData.exams" :key="exam.id" class="p-4 border rounded-lg">
                        <h3 class="font-semibold">{{ exam.title }}</h3>
                        <p class="text-sm text-gray-600">
                            Start: {{ new Date(exam.startTime).toLocaleString() }}
                        </p>
                        <p class="text-sm text-gray-600">
                            End: {{ new Date(exam.endTime).toLocaleString() }}
                        </p>
                        <Button class="mt-2" @click="goToExam(exam.id)">Go to Exam</Button>
                    </li>
                </ul>
            </div>
        </div>
        <div v-else-if="error" class="text-center text-red-500">
            {{ error }}
        </div>
        <div v-else class="text-center">
            <p>Loading dashboard data...</p>
        </div>
    </AppContainer>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const { data: dashboardData, error } = await useFetch(`/api/courses/${route.params.slug}/dashboard`)

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