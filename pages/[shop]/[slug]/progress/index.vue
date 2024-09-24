<template>

    <div v-if="dashboardData" class="flex flex-col-reverse gap-3 md:flex-col">

        <!-- Progress Overview -->
        <div class="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2">
            <ProgressCard title="লাইভ ক্লাস সমূহ" :progress="dashboardData.progress.liveLessons" />
            <ProgressCard title="আর্কাইভ ক্লাস সমূহ" :progress="dashboardData.progress.archivedLessons" />
        </div>

        <ExamProgressReport :examProgress="dashboardData.progress.exams" />



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