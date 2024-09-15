<template>
    <AppContainer>
        <div class="container py-8 mx-auto">

            <div v-if="status === 'success'" class="grid gap-6 lg:grid-cols-2">
                <Card v-for="assignment in assignments" :key="assignment.id" class="flex flex-col">



                    <CardHeader>
                        <CardTitle>{{ assignment.title }}</CardTitle>
                        <CardDescription>{{ assignment.subject.name }}</CardDescription>
                    </CardHeader>
                    <CardContent class="flex-grow">
                        <p class="mb-2">{{ assignment.description }}</p>
                        <p class="text-sm text-gray-500">
                            Total Marks: {{ assignment.total_marks }}
                        </p>
                        <p class="text-sm text-gray-500">
                            Start Date: {{ formatDate(assignment.startDate) }}
                        </p>
                        <p class="text-sm text-gray-500">
                            End Date: {{ formatDate(assignment.endDate) }}
                        </p>
                    </CardContent>
                    <CardFooter class="flex justify-between">
                        <Button @click="participate(assignment.id)">Participate</Button>
                        <Button variant="outline" @click="viewLeaderboard(assignment.id)">Leaderboard</Button>
                        <Button variant="outline" @click="viewSolution(assignment.id)">Solution</Button>
                    </CardFooter>
                </Card>
            </div>
            <div v-else class="text-center text-gray-500">
                কোন লিখিত পরীক্ষা প্রস্তুত নেই।
            </div>
        </div>
    </AppContainer>
</template>

<script setup>
import { useToast } from '@/components/ui/toast'

definePageMeta({
    layout: 'course'
})

const route = useRoute()
const { toast } = useToast()

// const { data: assignments, status } = await useFetch(`/api/courses/${route.params.slug}/assignments`)

const assignments = ref([])

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString()
}

const participate = (assignmentId) => {
    navigateTo(`/${route.params.shop}/${route.params.slug}/assignments/${assignmentId}`)
}

const viewLeaderboard = (assignmentId) => {

}

const viewSolution = (assignmentId) => {

}
</script>

<style lang="scss" scoped></style>