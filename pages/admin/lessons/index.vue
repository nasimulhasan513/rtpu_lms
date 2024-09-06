<template>
    <div>
        <div class="flex justify-between mb-4">
            <AppHeading title="Classes" />
            <Button @click="onOpen">
                <Icon name="tabler:plus" class="mr-2" />
                Add new class
            </Button>
        </div>

        <div class="p-4 mb-6 bg-gray-100 rounded-lg">
            <h3 class="mb-2 text-lg font-semibold">Select Courses</h3>
            <div class="flex flex-wrap gap-2">
                <div v-for="course in courses" :key="course.id" 
                     @click="toggleCourseSelection(course.id)"
                     class="p-2 text-sm rounded-md cursor-pointer"
                     :class="selectedCourses.includes(course.id) ? 'bg-primary text-white border-2 border-black' : 'bg-white border border-gray-300'">
                    {{ course.name }}
                </div>
            </div>
        </div>

        <div class="flex mb-4 space-x-4">
            <Select v-model="selectedSubject" placeholder="Filter by Subject">
                <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Subject" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="subject in subjects" :key="subject.id" :value="subject.id">
                        {{ subject.name }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="selectedChapter" placeholder="Filter by Chapter">
                <SelectTrigger class="w-[180px]">
                    <SelectValue placeholder="Chapter" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem v-for="chapter in chapters" :key="chapter.id" :value="chapter.id">
                        {{ chapter.name }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>

        <div v-if="status === 'success'" class="bg-white rounded-lg shadow">
            <Table>
                <TableCaption>List of Lessons</TableCaption>
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
                <TableBody>
                    <TableRow v-for="lesson, i in filteredLessons" :key="lesson.id">
                        <TableCell>
                            <Checkbox :checked="lesson.selected"
                                @click="filteredLessons[i].selected = !filteredLessons[i].selected" />
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
                            <Button @click="editLesson(lesson)" variant="outline">
                                <Icon name="tabler:edit" />
                            </Button>
                            <Button @click="deleteLesson(lesson.id)" variant="destructive">
                                <Icon name="tabler:trash" />
                            </Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>

            <div class="p-4 mt-4">
                <Button @click="assignLessonsToCourses" class="mt-2">Assign Selected Lessons to Courses</Button>
            </div>
        </div>
        <LessonModal />
    </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
    layout: 'admin',
})

const { data, status, error, refresh } = await useFetch('/api/admin/lessons', {
    key: 'admin-lessons',
    transform: (data) => data.body.map(l => ({ ...l, selected: false }))
})

const { onOpen, onEdit } = useLesson()
const { fetchSubjects, subjects } = useSubject()
const { courses, fetchCourses } = useCourse()
const chapters = ref([])

const selectedSubject = ref(null)
const selectedChapter = ref(null)
const selectedLessons = ref([])
const selectAll = ref(false)
const selectedCourses = ref([])

const { toast } = useToast()

onMounted(() => {
    fetchSubjects()
    fetchCourses()
})

const filteredLessons = ref([])

watch(selectedSubject, (value) => {
    if (value) {
        chapters.value = subjects.value.find(s => s.id === value).chapters
    }
}, { deep: true })

watch([selectedSubject, selectedChapter], () => {
    filteredLessons.value = data.value.filter(lesson =>
        (!selectedSubject.value || lesson.subject.id === selectedSubject.value) &&
        (!selectedChapter.value || lesson.chapter.id === selectedChapter.value)
    )
})

onMounted(() => {
    filteredLessons.value = data.value
})

const toggleSelectAll = () => {
    selectAll.value = !selectAll.value
    filteredLessons.value = filteredLessons.value.map(l => ({ ...l, selected: selectAll.value }))
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
    const selectedLessonIds = filteredLessons.value.filter(l => l.selected).map(l => l.id)
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
        filteredLessons.value = filteredLessons.value.map(l => ({ ...l, selected: false }))
    } catch (error) {
        console.error('Error assigning lessons to courses:', error)
        toast({
            title: 'Error assigning lessons to courses',
            description: error.toString(),
            variant: 'destructive'
        })
    }
}
</script>