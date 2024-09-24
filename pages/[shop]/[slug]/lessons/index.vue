<template>

    <div v-if="status === 'success' && data.lessons.length === 0" class="flex items-center justify-center h-64">
        <p class="text-lg text-center text-red-500">
            কোর্সে কোনো ক্লাস নেই
        </p>
    </div>
    <div class="space-y-6" v-if="status === 'success' && data.lessons.length > 0">

        <!-- Breadcrumb -->
        <div class="flex items-center space-x-2">

            <Button variant="outline" size="sm"
                @click="navigateTo(`/${route.params.shop}/${route.params.slug}/lessons`)">
                বিষয়সমূহ
            </Button>
            <div v-if="currentView !== 'subjects'" class="flex items-center">
                <ChevronRightIcon class="w-4 h-4" />
                <Button variant="outline" size="sm" @click="selectSubject(selectedSubject)">
                    {{ selectedSubject.name }}
                </Button>
            </div>
            <div v-if="currentView === 'lessons'" class="flex items-center">
                <ChevronRightIcon class="w-4 h-4" />
                <Button variant="outline" size="sm" disabled>
                    {{ selectedChapter.name }}
                </Button>
            </div>
        </div>

        <!-- Subjects View -->
        <div v-if="currentView === 'subjects'" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <LessonSubjectThumbnail v-for="subject in subjects" :key="subject.id" :subject="subject"
                class="cursor-pointer" @click="selectSubject(subject)" />
        </div>

        <!-- Chapters View -->
        <div v-if="currentView === 'chapters'" class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">

            <LessonChapterThumbnail v-for="chapter in chapters" :key="chapter.id" :chapter="chapter"
                class="cursor-pointer" @click="selectChapter(chapter)" />
        </div>

        <!-- Lessons View -->
        <div v-if="currentView === 'lessons'" class="space-y-6">
            <div v-if="lessons.recentLessons.length > 0">
                <h1 class="text-2xl font-bold">

                    <span class="text-rose-500">লাইভ </span>
                    <span class="text-primary"> ক্লাসসমূহ</span>

                </h1>
                <div class="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <LessonThumbnail v-for="lesson in lessons.recentLessons" :key="lesson.id" :lesson="lesson"
                        class="cursor-pointer" @click="navigateLesson(lesson)" />
                </div>
            </div>
            <div v-if="lessons.archiveLessons.length > 0">
                <h1 class="text-2xl font-bold">
                    <span class="text-rose-500">আর্কাইভ</span> <span class="text-primary">ক্লাসসমূহ</span>
                </h1>
                <div class="grid grid-cols-1 gap-4 mt-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    <LessonThumbnail v-for="lesson in lessons.archiveLessons" :key="lesson.id" :lesson="lesson"
                        class="cursor-pointer" @click="navigateLesson(lesson)" />
                </div>
            </div>
        </div>

       

      
    </div>
    <Alert v-if="error" variant="destructive">
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
                {{ error.message }}
            </AlertDescription>
        </Alert>
    <div v-if="status === 'pending'" class="flex items-center justify-center h-64">
            <Spinner />
        </div>

</template>

<script setup>
import { ChevronRightIcon } from 'lucide-vue-next'
definePageMeta({
    layout: 'course',
    middleware: 'enrolled'
})

const route = useRoute()
const router = useRouter()
const nuxtApp = useNuxtApp()
const { data, status, error, refresh } = await useFetch(`/api/courses/${route.params.slug}/lessons`, {

    query: {
        is_archive: false
    },

    transform(input) {
        return {
            ...input,
            fetchedAt: new Date()
        }
    },
    getCachedData(key) {
        const data = nuxtApp.payload.data[key] || nuxtApp.static.data[key]
        if (!data) {
            return
        }

        // Is the data older than 1 hour?
        const expirationDate = new Date(data.fetchedAt)
        expirationDate.setHours(expirationDate.getHours() + 1)
        const isExpired = expirationDate.getTime() < Date.now()
        if (isExpired) {
            return
        }
        return data
    }
})

const subjects = computed(() => {
    const subjectMap = new Map()
    data.value.lessons.forEach(lesson => {
        if (lesson.lesson && lesson.lesson.subject) {
            const subject = lesson.lesson.subject
            if (!subjectMap.has(subject.id)) {
                subjectMap.set(subject.id, {
                    ...subject,
                    totalChapters: 1,
                    totalLessons: 1
                })
            }
            subjectMap.get(subject.id).totalLessons++
            if (!subjectMap.get(subject.id).chapters) {
                subjectMap.get(subject.id).chapters = new Set()
            }
            if (lesson.lesson.chapter) {
                subjectMap.get(subject.id).chapters.add(lesson.lesson.chapter.id)
            }
        }
    })

    subjectMap.forEach(subject => {
        subject.totalChapters = subject.chapters ? subject.chapters.size : 0
        delete subject.chapters
    })
    return Array.from(subjectMap.values()).sort((a, b) => a.order - b.order)
})

const selectedSubject = ref(null)
const selectedChapter = ref(null)

const chapters = computed(() => {
    if (!selectedSubject.value) return []
    return data.value.lessons
        .filter(lesson => lesson.lesson && lesson.lesson.subject && lesson.lesson.subject.id === selectedSubject.value.id)
        .reduce((acc, lesson) => {
            const chapter = lesson.lesson.chapter;
            if (chapter) {
                const existingChapter = acc.find(c => c.id === chapter.id);
                if (existingChapter) {
                    existingChapter.totalLessons++;
                } else {
                    acc.push({
                        ...chapter,
                        totalLessons: 1
                    });
                }
            }
            return acc;
        }, [])
        .sort((a, b) => a.order - b.order);
})

const lessons = computed(() => {
    if (!selectedChapter.value) return []
    let actualLessons = data.value.lessons.filter(lesson => lesson.lesson && lesson.lesson.chapter && lesson.lesson.chapter.id === selectedChapter.value.id)
        .map(lesson => lesson.lesson)
        .sort((a, b) => a.order - b.order)

    let recentLessons = actualLessons.filter(lesson => lesson.is_archive === false)
    let archiveLessons = actualLessons.filter(lesson => lesson.is_archive === true)
    return {
        recentLessons,
        archiveLessons
    }
})

const currentView = computed(() => {
    if (route.query.chapterId) return 'lessons'
    if (route.query.subjectId) return 'chapters'
    return 'subjects'
})

const selectSubject = (subject) => {
    selectedSubject.value = subject
    router.push({ query: { subjectId: subject.id } })
}

const selectChapter = (chapter) => {
    selectedChapter.value = chapter
    router.push({ query: { subjectId: selectedSubject.value.id, chapterId: chapter.id } })
}

const navigateLesson = (lesson) => {
    navigateTo(`/${route.params.shop}/${route.params.slug}/lessons/${lesson.id}`)
}

watch(route, () => {
    if (route.query.subjectId) {
        selectedSubject.value = subjects.value.find(s => s.id === route.query.subjectId)
    }
    if (route.query.chapterId) {
        selectedChapter.value = chapters.value.find(c => c.id === route.query.chapterId)
    }
    refresh()
}, { immediate: true, deep: true })
</script>

<style lang="scss" scoped></style>