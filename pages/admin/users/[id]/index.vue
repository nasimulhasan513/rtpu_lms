<template>

    <div v-if="dashboardData" class="flex flex-col-reverse gap-3 md:flex-col">

        <!-- Progress Overview -->
        <div class="grid grid-cols-1 gap-6 mb-12 md:grid-cols-2">
            <ProgressSummary title="লাইভ ক্লাস সমূহ" :progress="dashboardData.progress.liveLessons" />
            <ProgressSummary title="আর্কাইভ ক্লাস সমূহ" :progress="dashboardData.progress.archivedLessons" />
        </div>

        <ProgressReport :examProgress="dashboardData.progress.exams" />



    </div>
    <div v-else-if="error" class="text-center text-red-500">
        কোন পরীক্ষায় অংশগ্রহণ না করায় প্রোগ্রেস রিপোর্ট দেখা যাবে না
    </div>
    <div v-else class="text-center">
        <p> প্রোগ্রেস রিপোর্ট লোড হচ্ছে...</p>
    </div>



</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})


const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const nuxtApp = useNuxtApp()

const { data: dashboardData, error } = useFetch(`/api/auth/${route.params.id}?slug=${route.query.course}`, {
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