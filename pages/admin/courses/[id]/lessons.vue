<template>
    <div>
        <div class="flex justify-between mb-4">
            <AppHeading title="Classes" />
            <Button @click="onOpen(route.params.id)">
                <Icon name="tabler:plus" class="mr-2" />
                Add new class
            </Button>
        </div>
        <div class="flex justify-between mb-4 space-x-4">
            <div class="flex gap-4">
                <Input v-model="search" placeholder="Search by title or content" />

                <Select v-model="selectedSubject" @update:modelValue="fetchLessons">
                    <SelectTrigger class="w-[180px] bg-background">
                        <SelectValue placeholder="Subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="subject in subjects" :key="subject.id" :value="subject.id">
                            {{ subject.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>

                <Select v-model="selectedChapter" @update:modelValue="fetchLessons">
                    <SelectTrigger class="w-[180px] bg-background">
                        <SelectValue placeholder="Chapter" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem v-for="chapter in chapters" :key="chapter.id" :value="chapter.id">
                            {{ chapter.name }}
                        </SelectItem>
                    </SelectContent>
                </Select>
            </div>


        </div>

        <div class="bg-white rounded-lg shadow">
            <Table>
                <TableHeader>
                    <TableRow>

                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Chapter</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Archive</TableHead>
                        <TableHead>Downloadable</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody v-if="status === 'success'">
                    <TableRow v-for="lesson, i in data" :key="lesson.id">

                        <TableCell>{{ lesson.title }}</TableCell>
                        <TableCell>{{ lesson.subject.name }}</TableCell>
                        <TableCell>{{ lesson.chapter.name }}</TableCell>
                        <TableCell>
                            <Badge>
                                {{ lesson.source.toUpperCase() }}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Button @click="viewContent(lesson.content)">
                                <Icon name="tabler:eye" />
                            </Button>
                        </TableCell>
                        <TableCell>
                            <Badge>
                                {{ lesson.is_archive ? 'Yes' : 'No' }}
                            </Badge>
                        </TableCell>
                        <TableCell>
                            <Badge>
                                {{ lesson.is_downloadable ? 'Yes' : 'No' }}
                            </Badge>
                        </TableCell>
                        <TableCell>{{ new Date(lesson.createdAt).toLocaleDateString() }}</TableCell>
                        <TableCell>
                            <div class="flex gap-2">
                                <Button @click="editLesson(lesson)" variant="outline">
                                    <Icon name="tabler:edit" />
                                </Button>
                                <Button @click="deleteLesson(lesson.id)" variant="destructive">
                                    <Icon name="tabler:trash" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
                <div v-if="status === 'pending'" class="flex items-center justify-center p-4">
                    <AppLoader />
                </div>
            </Table>

            <div class="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
                <div class="flex items-center">
                    <span class="text-sm text-gray-700">
                        Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to {{ Math.min(currentPage * itemsPerPage,
                totalCount) }} of {{ totalCount }} results
                    </span>
                </div>
                <div class="flex justify-between mt-4 sm:mt-0">
                    <Button :disabled="currentPage === 1" @click="currentPage--" class="mr-2">
                        Previous
                    </Button>
                    <Button :disabled="currentPage === totalPages" @click="currentPage++">
                        Next
                    </Button>
                </div>
            </div>
        </div>

        <LessonModal />
    </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

const search = ref('')
const selectedSubject = ref(null)
const selectedChapter = ref(null)
const selectAll = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalCount = ref(0)
const totalPages = ref(0)

const route = useRoute()
const { data, status, error, refresh } = await useFetch('/api/admin/lessons', {
    key: 'admin-lessons',
    query: computed(() => ({
        page: currentPage.value,
        limit: itemsPerPage.value,
        search: search.value,
        courseId: route.params.id,
        subjectId: selectedSubject.value,
        chapterId: selectedChapter.value,
    })),
    transform: (response) => {
        totalCount.value = response.body.totalCount
        totalPages.value = response.body.totalPages
        return response.body.lessons.map(l => ({ ...l, selected: false }))
    }
})
watchDebounced(search, () => {
    currentPage.value = 1
    refresh()
}, { debounce: 300 })



const fetchLessons = () => {
    currentPage.value = 1 // Reset to first page on filter change
    refresh()
}

const { onOpen, onEdit } = useLesson()
const { subjects, fetchSubjects } = useSubject()
const chapters = ref([])
onMounted(() => {
    fetchSubjects()
})

watch(selectedSubject, (value) => {
    if (value) {
        chapters.value = subjects.value.find(s => s.id === value).chapters
    }
}, { deep: true })





const viewContent = (content) => {
    window.open(content, '_blank')
}

const deleteLesson = async (lessonId) => {
    if (confirm('Are you sure you want to delete this lesson?')) {
        try {
            await $fetch(`/api/admin/lessons/${lessonId}`, {
                method: 'DELETE',
            })
            refresh()
        } catch (error) {
            console.error('Error deleting lesson:', error)
        }
    }
}

const editLesson = (lesson) => {
    onEdit(lesson)
}



watch([currentPage, itemsPerPage], () => {
    refresh()
})



const { getTeachers } = useTeachers()

onMounted(async () => {
    await getTeachers()
})





</script>