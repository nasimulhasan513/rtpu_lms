import type { Chapter, Lesson, Subject } from "@prisma/client";
import { ref, computed } from "vue";

 const subjects = ref<Subject[]>([]);
 const chapters = ref<Chapter[]>([]);
 const lessons = ref<Lesson[]>([]);
 const currentView = ref<"subjects" | "chapters" | "lessons">("subjects");
 const currentSubject = ref<string | null>(null);
 const currentChapter = ref<string | null>(null);
 const currentLesson = ref<Lesson | null>(null);
 const completedLessons = ref<Set<string>>(new Set());

export function useCourseLesson() {
 
  const currentItems = computed(() => {
    switch (currentView.value) {
      case "subjects":
        return subjects.value;
      case "chapters":
        return chapters.value;
      case "lessons":
        return lessons.value;
      default:
        return [];
    }
  });

  const currentItemId = computed(() => {
    switch (currentView.value) {
      case "subjects":
        return currentSubject.value;
      case "chapters":
        return currentChapter.value;
      case "lessons":
        return currentLesson.value?.id || null;
      default:
        return null;
    }
  });

  function organizeData(courseData: any) {
    const subjectsMap = new Map<string, Subject>();
    const chaptersMap = new Map<string, Chapter>();

    courseData.lessons.forEach((item: any) => {
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

    if (subjects.value.length > 0 && subjects.value[0].chapters.length > 0) {
      const firstChapter = subjects.value[0].chapters[0];
      if (firstChapter.lessons.length > 0) {
        currentLesson.value = firstChapter.lessons[0];
      }
    }
  }

  function selectSubject(subjectId: string) {
    currentSubject.value = subjectId;
    currentView.value = "chapters";
    updateChapters();
  }

  function selectChapter(chapterId: string) {
    currentChapter.value = chapterId;
    currentView.value = "lessons";
    updateLessons();

    if (lessons.value.length > 0) {
      currentLesson.value = lessons.value[0];
    }
  }

  function selectLesson(lessonId: string) {
    currentLesson.value =
      lessons.value.find((lesson) => lesson.id === lessonId) || null;
  }

  function updateChapters() {
    const selectedSubject = subjects.value.find(
      (s) => s.id === currentSubject.value
    );
    chapters.value = selectedSubject?.chapters || [];
  }

  function updateLessons() {
    const selectedChapter = chapters.value.find(
      (c) => c.id === currentChapter.value
    );
    lessons.value = selectedChapter?.lessons || [];
  }

  function navigateBack() {
    if (currentView.value === "lessons") {
      currentView.value = "chapters";
      currentLesson.value = null;
    } else if (currentView.value === "chapters") {
      currentView.value = "subjects";
      currentChapter.value = null;
    }
  }

  function isLessonCompleted(lessonId: string) {
    return completedLessons.value.has(lessonId);
  }

  function toggleLessonCompletion(lessonId: string) {
    if (completedLessons.value.has(lessonId)) {
      completedLessons.value.delete(lessonId);
    } else {
      completedLessons.value.add(lessonId);
    }
  }

  return {
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
  };
}
