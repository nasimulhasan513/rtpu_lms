<template>
    <div class="container p-4 mx-auto">
        <h1 class="mb-4 text-2xl font-bold">Assignment Submissions</h1>
        <div class="mb-4">
            <Select v-model="selectedAssignment" :options="assignmentOptions" placeholder="Filter by Assignment" />
        </div>
        <Table :columns="columns" :data="filteredSubmissions" />
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})
const { data: submissions } = await useFetch('/api/assignment-submissions')
const { data: assignments } = await useFetch('/api/assignments')

const selectedAssignment = ref('')

const assignmentOptions = computed(() =>
    assignments.value?.map(assignment => ({ label: assignment.title, value: assignment.id })) || []
)

const columns = [
    { key: 'user', label: 'User' },
    { key: 'assignment', label: 'Assignment' },
    { key: 'submittedAt', label: 'Submitted At' },
    { key: 'grade', label: 'Grade' },
    { key: 'actions', label: 'Actions' }
]

const filteredSubmissions = computed(() => {
    if (!selectedAssignment.value) return submissions.value
    return submissions.value?.filter(submission => submission.assignmentId === selectedAssignment.value)
})
</script>

<style lang="scss" scoped></style>