<template>
    <div>
        <div class="flex justify-between mb-4">
            <AppHeading title="Classes" />
        </div>

        <div class="p-4 mb-6 bg-gray-100 rounded-lg">
            <h3 class="mb-2 text-lg font-semibold">Select Courses</h3>
            <div class="flex flex-wrap gap-2">
                <div v-for="course in courses" :key="course.id" @click="toggleCourseSelection(course.id)"
                    class="p-2 text-sm rounded-md cursor-pointer"
                    :class="selectedCourses.includes(course.id) ? 'bg-primary text-white border-2 border-black' : 'bg-white border border-gray-300'">
                    {{ course.name }}
                </div>
            </div>
        </div>

        <div class="flex justify-between mb-4 space-x-4">
            <div class="flex gap-4">
                <Input v-model="search" placeholder="Search by title or content" @input="debouncedFetch" />

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

            <Button @click="assignLessonsToCourses" class="mt-2">Assign Selected Lessons to Courses</Button>
        </div>

        <div class="bg-white rounded-lg shadow">
            <h3 class="p-4 text-lg font-semibold">Live Classes</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-[50px]">
                            <Checkbox :checked="selectAll" @click="toggleSelectAll" />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Chapter</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Assigned Courses</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody v-if="status === 'success'">
                    <TableRow v-for="lesson, i in liveLessons" :key="lesson.id">
                        <TableCell>
                            <Checkbox :checked="lesson.selected" @click="liveLessons[i].selected = !liveLessons[i].selected" />
                        </TableCell>
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
                            <div class="flex flex-wrap gap-1">
                                <Badge v-for="course in lesson.courses" :key="course.id" variant="secondary">
                                    {{ course.name }}
                                </Badge>
                            </div>
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

            <h3 class="p-4 text-lg font-semibold">Archived Classes</h3>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead class="w-[50px]">
                            <Checkbox :checked="selectAll" @click="toggleSelectAll" />
                        </TableHead>
                        <TableHead>Title</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Chapter</TableHead>
                        <TableHead>Source</TableHead>
                        <TableHead>Content</TableHead>
                        <TableHead>Assigned Courses</TableHead>
                        <TableHead>Created At</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody v-if="status === 'success'">
                    <TableRow v-for="lesson, i in archivedLessons" :key="lesson.id">
                        <TableCell>
                            <Checkbox :checked="lesson.selected" @click="archivedLessons[i].selected = !archivedLessons[i].selected" />
                        </TableCell>
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
                            <div class="flex flex-wrap gap-1">
                                <Badge v-for="course in lesson.courses" :key="course.id" variant="secondary">
                                    {{ course.name }}
                                </Badge>
                            </div>
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

const { data, status, error, refresh } = await useFetch('/api/admin/lessons', {
    key: 'admin-lessons',
    query: computed(() => ({
        page: currentPage.value,
        limit: itemsPerPage.value,
        search: search.value,
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

const { onEdit } = useLesson()
const { subjects, fetchSubjects } = useSubject()
const { courses, fetchCourses } = useCourse()
const chapters = ref([])

const selectedCourses = ref([])

const { toast } = useToast()

onMounted(() => {
    fetchSubjects()
    fetchCourses()
})

watch(selectedSubject, (value) => {
    if (value) {
        chapters.value = subjects.value.find(s => s.id === value).chapters
    }
}, { deep: true })

const toggleSelectAll = () => {
    selectAll.value = !selectAll.value
    data.value = data.value.map(l => ({ ...l, selected: selectAll.value }))
}

const toggleCourseSelection = (courseId) => {
    const index = selectedCourses.value.indexOf(courseId)
    if (index === -1) {
        selectedCourses.value.push(courseId)
    } else {
        selectedCourses.value.splice(index, 1)
    }
}

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

const assignLessonsToCourses = async () => {
    const selectedLessonIds = data.value.filter(l => l.selected).map(l => l.id)
    if (selectedLessonIds.length === 0 || selectedCourses.value.length === 0) {
        toast({
            title: 'Please select lessons and courses',
            variant: 'destructive'
        })
        return
    }

    try {
        await $fetch('/api/admin/lessons/assign-courses', {
            method: 'POST',
            body: {
                lessonIds: selectedLessonIds,
                courseIds: selectedCourses.value
            }
        })
        toast({
            title: 'Lessons assigned to courses successfully',
            variant: 'success'
        })
        refresh()
        selectedCourses.value = []
        selectAll.value = false
        data.value = data.value.map(l => ({ ...l, selected: false }))
    } catch (error) {
        console.error('Error assigning lessons to courses:', error)
        toast({
            title: 'Error assigning lessons to courses',
            description: error.toString(),
            variant: 'destructive'
        })
    }
}

const liveLessons = computed(() => data.value.filter(lesson => !lesson.is_archive))
const archivedLessons = computed(() => data.value.filter(lesson => lesson.is_archive))

watch([currentPage, itemsPerPage], () => {
    refresh()
})
</script>