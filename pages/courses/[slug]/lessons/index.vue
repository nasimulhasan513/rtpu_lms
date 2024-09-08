<template>
    <div>
        <div class="px-4 mx-auto sm:px-6 lg:px-8">
            <Breadcrumb :items="breadcrumbItems" class="mb-6" />

            <div class="grid grid-cols-1 gap-6 md:grid-cols-4">
                <!-- Sidebar -->
                <div class="md:col-span-1">
                    <LessonSidebar :title="sidebarTitle" :items="currentItems" :current-item-id="currentItemId"
                        :show-back-button="currentView !== 'subjects'" :is-completed="isLessonCompleted"
                        @select="handleItemSelect" @back="navigateBack" />
                </div>

                <!-- Main Content -->
                <div class="md:col-span-3">
                    <div v-if="currentLesson" class="border rounded-lg bg-background">
                        <div class="p-6">
                            <h2 class="mb-2 text-2xl font-semibold">{{ currentLesson.title }}</h2>
                            <p class="mb-4 text-muted-foreground">
                                {{ currentLesson.subject?.name }} > {{ currentLesson.chapter?.name }}
                            </p>
                            <div class="mb-4 aspect-video">

                                <!-- <pre>
                                    {{ currentLesson }}
                                </pre> -->



                                <iframe v-if="currentLesson.source === 'youtube'"
                                    :src="getYoutubeEmbedUrl(currentLesson.content)" class="w-full h-full"
                                    frameborder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowfullscreen></iframe>
                            </div>
                            <div class="flex items-center justify-between">
                                <Button v-if="currentLesson.pdf" @click="downloadPdf">
                                    <Download class="w-4 h-4 mr-2" />
                                    Download Lecture Sheet
                                </Button>
                                <Button @click="toggleLessonCompletion(currentLesson.id)"
                                    :variant="isLessonCompleted(currentLesson.id) ? 'secondary' : 'default'">
                                    {{ isLessonCompleted(currentLesson.id) ? 'Completed' : 'Mark as Completed' }}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { Download } from 'lucide-vue-next'

definePageMeta({
    layout: 'blank',
})

const route = useRoute()
const router = useRouter()
const { data: courseData, error } = await useFetch(`/api/courses/${route.params.slug}/lessons`)

const {
    subjects,
    chapters,
    lessons,
    currentView,
    currentSubject,
    currentChapter,
    currentLesson,
    currentItems,
    currentItemId,
    organizeData,
    selectSubject,
    selectChapter,
    selectLesson,
    navigateBack,
    isLessonCompleted,
    toggleLessonCompletion,
} = useCourseLesson()

const sidebarTitle = computed(() => {
    switch (currentView.value) {
        case 'subjects':
            return 'Subjects'
        case 'chapters':
            return currentSubject.value?.name || 'Chapters'
        case 'lessons':
            return currentChapter.value?.name || 'Lessons'
        default:
            return ''
    }
})

const breadcrumbItems = computed(() => {
    const items = [{ label: 'Subjects', href: '#', onClick: () => navigateTo('subjects') }]
    if (currentView.value === 'chapters' || currentView.value === 'lessons') {
        items.push({ label: 'Chapters', href: '#', onClick: () => navigateTo('chapters') })
    }
    if (currentView.value === 'lessons') {
        items.push({ label: 'Lessons', href: '#', onClick: () => navigateTo('lessons') })
    }
    return items
})

onMounted(() => {
    if (courseData.value) {
        organizeData(courseData.value)
        updateViewFromQuery()
    }
})

function updateViewFromQuery() {
    const { subject, chapter } = route.query
    if (subject && chapter) {
        selectSubject(subject as string)
        selectChapter(chapter as string)
    } else if (subject) {
        selectSubject(subject as string)
    }
}

function handleItemSelect(id: string) {
    switch (currentView.value) {
        case 'subjects':
            selectSubject(id)
            break
        case 'chapters':
            selectChapter(id)
            break
        case 'lessons':
            selectLesson(id)
            break
    }
    updateQuery()
}

function updateQuery() {
    const query: { subject?: string; chapter?: string } = {}
    if (currentSubject.value) query.subject = currentSubject.value
    if (currentChapter.value) query.chapter = currentChapter.value
    router.push({ query })
}

function navigateTo(view: 'subjects' | 'chapters' | 'lessons') {
    currentView.value = view
    if (view === 'subjects') {
        currentSubject.value = null
        currentChapter.value = null
    } else if (view === 'chapters') {
        currentChapter.value = null
    }
    updateQuery()
}

function getYoutubeEmbedUrl(url: string) {
    const videoId = url.split('v=')[1]
    return `https://www.youtube.com/embed/${videoId}`
}

function downloadPdf() {
    if (currentLesson.value?.pdf) {
        // Implement PDF download logic
        console.log('Downloading PDF:', currentLesson.value.pdf)
    }
}

watch(() => route.query, updateViewFromQuery)
</script>

<style lang="scss" scoped></style>