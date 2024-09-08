import type { Lesson } from "@prisma/client";

const state = reactive({
  isOpen: false,
  initialValues: {} as Lesson,
  courseIds: [] as string[],
});

export default function useLesson() {
  const { isOpen, initialValues, courseIds } = toRefs(state);

  const onOpen = (courseIds: string) => {
    state.isOpen = true;
    state.courseIds = [courseIds];
    state.initialValues = {} as Lesson;
  };

  const onClose = () => {
    state.isOpen = false;
  };

  const onEdit = (lesson: Lesson) => {
    state.initialValues = lesson;
    state.isOpen = true;
    state.courseIds = lesson.courses.map((c) => c.id);
  };

  return {
    isOpen,
    onOpen,
    onClose,
    onEdit,
    initialValues,
    courseIds,
  };
}
