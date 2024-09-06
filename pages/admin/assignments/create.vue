<template>
    <div class="container p-4 mx-auto">
        <h1 class="mb-4 text-2xl font-bold">Create Assignment</h1>
        <form @submit.prevent="createAssignment">
            <div class="mb-4">
                <Label for="title">Title</Label>
                <Input id="title" v-model="form.title" required />
            </div>
            <div class="mb-4">
                <Label for="description">Description</Label>
                <Textarea id="description" v-model="form.description" required />
            </div>
            <div class="mb-4">
                <Label for="course">Course</Label>
                <Select id="course" v-model="form.courseId">
                    <SelectTrigger>
                        <SelectValue placeholder="Select a course" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="course in courseOptions" :key="course.value" :value="course.value">
                            {{ course.label }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div class="mb-4">
                <Label for="total_marks">Total Marks</Label>
                <Input id="total_marks" v-model="form.total_marks" type="number" required />
            </div>
            <div class="mb-4">
                <Label for="startDate">Start Date</Label>
                <Input id="startDate" v-model="form.startDate" type="datetime-local" required />
            </div>
            <div class="mb-4">
                <Label for="endDate">End Date</Label>
                <Input id="endDate" v-model="form.endDate" type="datetime-local" required />
            </div>
            <div class="mb-4">
                <Label for="pdf">PDF File</Label>
                <Input id="pdf" type="file" @change="handleFileUpload" accept=".pdf" />
            </div>
            <Button type="submit">Create Assignment</Button>
        </form>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})
import { useToast } from '~/components/ui/toast';

const { courses, fetchCourses } = await useCourse()

const { uploadImage } = useCloudflareImage()
const { toast } = useToast()

const form = reactive({
    title: '',
    description: '',
    courseId: '',
    total_marks: 0,
    startDate: '',
    endDate: '',
    pdf: null
})





const courseOptions = computed(() =>
    courses.value?.map(course => ({ label: course.name, value: course.id })) || []
)

const handleFileUpload = (event) => {
    form.pdf = event.target.files[0]
}

const createAssignment = async () => {
    try {
        if (form.pdf) {
            form.pdfUrl = await uploadImage(form.pdf)
        }

        const response = await $fetch('/api/admin/assignments', {
            method: 'POST',
            body: {
                ...form,
                startDate: new Date(form.startDate).toISOString(),
                endDate: new Date(form.endDate).toISOString(),
                pdf: form.pdfUrl,
                pdfUrl: undefined
            }
        })

        toast({ title: 'Assignment created successfully' })
        // navigateTo('/admin/assignments')
    } catch (error) {
        toast({ title: 'Failed to create assignment' })
        console.error(error)
    }
}


onMounted(async () => {
    await fetchCourses()
})
</script>