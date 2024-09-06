<template>
    <div class="container p-4 mx-auto">
        <h1 class="mb-4 text-2xl font-bold">Assignments</h1>

        <div class="mb-4">
            <Select v-model="selectedCourse" :options="courseOptions" placeholder="Filter by Course" />
        </div>



        <div class="bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Course</TableHead>
                        <TableHead>Total Marks</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="assignment in filteredAssignments" :key="assignment.id">
                        <TableCell>{{ assignment.title }}</TableCell>
                        <TableCell>{{ assignment.course.name }}</TableCell>
                        <TableCell>{{ assignment.total_marks }}</TableCell>
                        <TableCell>{{ new Date(assignment.startDate).toLocaleDateString() }}</TableCell>
                        <TableCell>{{ new Date(assignment.endDate).toLocaleDateString() }}</TableCell>
                        <TableCell>{{ assignment.status }}</TableCell>
                        <TableCell>
                            <div class="flex gap-2">
                                <Button variant="outline" size="sm" @click="editAssignment(assignment.id)">Edit</Button>
                                <Button variant="destructive" size="sm"
                                    @click="deleteAssignment(assignment.id)">Delete</Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>


    </div>
</template>

<script setup>

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

const { data: assignments } = await useFetch('/api/admin/assignments')
const { courses, fetchCourses } = await useCourse()

const selectedCourse = ref('')

const courseOptions = computed(() =>
    courses.value?.map(course => ({ label: course.name, value: course.id })) || []
)

const columns = [
    { key: 'title', label: 'Title' },
    { key: 'course', label: 'Course' },
    { key: 'startDate', label: 'Start Date' },
    { key: 'endDate', label: 'End Date' },
    { key: 'status', label: 'Status' },
    { key: 'actions', label: 'Actions' }
]

const filteredAssignments = computed(() => {
    if (!selectedCourse.value) return assignments.value
    return assignments.value?.filter(assignment => assignment.courseId === selectedCourse.value)
})

const navigateToCreate = () => {
    navigateTo('/admin/assignments/create')
}

onMounted(async () => {
    await fetchCourses()
})


</script>

<style lang="scss" scoped></style>