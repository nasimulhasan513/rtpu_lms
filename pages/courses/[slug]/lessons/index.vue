<template>
    <AppContainer>

        <Breadcrumb :items="breadcrumbItems" />
        <div v-if="currentView === 'subjects'">
            <h2 class="mb-4 text-2xl font-bold">Subjects</h2>
            <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                <SubjectThumbnail v-for="subject in subjects" :key="subject.id" :subject="subject"
                    @click="selectSubject(subject.id)" />
            </div>
        </div>

        <div v-else-if="currentView === 'chapters'">
            <h2 class="mb-4 text-2xl font-bold">Chapters</h2>
            <ul class="space-y-2">
                <li v-for="chapter in chapters" :key="chapter.id">
                    <Button variant="outline" @click="selectChapter(chapter.id)">
                        {{ chapter.name }}
                    </Button>
                </li>
            </ul>
        </div>

        <div v-else-if="currentView === 'lessons'">
            <h2 class="mb-4 text-2xl font-bold">Lessons</h2>
            <ul class="space-y-2">
                <li v-for="lesson in lessons" :key="lesson.id">
                    <NuxtLink :to="`/courses/${route.params.slug}/lessons/${lesson.id}`">
                        <Button variant="outline">
                            {{ lesson.title }}
                        </Button>
                    </NuxtLink>
                </li>
            </ul>
        </div>
    </AppContainer>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'course',
});

const route = useRoute();
const router = useRouter();
const { data: courseData, error } = await useFetch(`/api/courses/${route.params.slug}/lessons`);

const subjects = ref<Subject[]>([]);
const chapters = ref<Chapter[]>([]);
const lessons = ref<Lesson[]>([]);
const currentView = ref<'subjects' | 'chapters' | 'lessons'>('subjects');
const currentSubject = ref<string | null>(null);
const currentChapter = ref<string | null>(null);

const breadcrumbItems = computed(() => {
    const items = [{ label: 'Subjects', href: '#', onClick: () => navigateTo('subjects') }];
    if (currentView.value === 'chapters' || currentView.value === 'lessons') {
        items.push({ label: 'Chapters', href: '#', onClick: () => navigateTo('chapters') });
    }
    if (currentView.value === 'lessons') {
        items.push({ label: 'Lessons', href: '#', onClick: () => navigateTo('lessons') });
    }
    return items;
});

onMounted(() => {
    if (courseData.value) {
        organizeData();
        updateViewFromQuery();
    }
});

function organizeData() {
    const subjectsMap = new Map<string, Subject>();
    const chaptersMap = new Map<string, Chapter>();

    courseData.value?.lessons.forEach((item) => {
        const { subject, chapter } = item.lesson;

        if (!subjectsMap.has(subject.id)) {
            subjectsMap.set(subject.id, { ...subject, chapters: [] });
        }

        if (!chaptersMap.has(chapter.id)) {
            const newChapter = { ...chapter, lessons: [] };
            chaptersMap.set(chapter.id, newChapter);
            subjectsMap.get(subject.id)?.chapters.push(newChapter);
        }

        chaptersMap.get(chapter.id)?.lessons.push(item.lesson);
    });

    subjects.value = Array.from(subjectsMap.values());
}

function updateViewFromQuery() {
    const { subject, chapter } = route.query;
    if (subject && chapter) {
        currentSubject.value = subject as string;
        currentChapter.value = chapter as string;
        currentView.value = 'lessons';
        updateLessons();
    } else if (subject) {
        currentSubject.value = subject as string;
        currentView.value = 'chapters';
        updateChapters();
    } else {
        currentView.value = 'subjects';
    }
}

function selectSubject(subjectId: string) {
    currentSubject.value = subjectId;
    currentView.value = 'chapters';
    updateChapters();
    updateQuery();
}

function selectChapter(chapterId: string) {
    currentChapter.value = chapterId;
    currentView.value = 'lessons';
    updateLessons();
    updateQuery();
}

function updateChapters() {
    const selectedSubject = subjects.value.find(s => s.id === currentSubject.value);
    chapters.value = selectedSubject?.chapters || [];
}

function updateLessons() {
    const selectedChapter = chapters.value.find(c => c.id === currentChapter.value);
    lessons.value = selectedChapter?.lessons || [];
}

function updateQuery() {
    const query: { subject?: string; chapter?: string } = {};
    if (currentSubject.value) query.subject = currentSubject.value;
    if (currentChapter.value) query.chapter = currentChapter.value;
    router.push({ query });
}

function navigateTo(view: 'subjects' | 'chapters' | 'lessons') {
    currentView.value = view;
    if (view === 'subjects') {
        currentSubject.value = null;
        currentChapter.value = null;
    } else if (view === 'chapters') {
        currentChapter.value = null;
    }
    updateQuery();
}

watch(() => route.query, updateViewFromQuery);

// Types
interface Subject {
    id: string;
    name: string;
    chapters: Chapter[];
}

interface Chapter {
    id: string;
    name: string;
    lessons: Lesson[];
}

interface Lesson {
    id: string;
    title: string;
}
</script>

<style lang="scss" scoped></style>