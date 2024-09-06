import type { Lesson } from "@prisma/client";

const state = reactive({
  isOpen: false,
  initialValues: {} as Lesson,
});

export default function useLesson() {
  const { isOpen, initialValues } = toRefs(state);

  const onOpen = () => {
    state.isOpen = true;
  };

  const onClose = () => {
    state.isOpen = false;
  };

  const onEdit = (lesson: Lesson) => {
    state.initialValues = lesson;
    state.isOpen = true;
  };

  return {
    isOpen,
    onOpen,
    onClose,
    onEdit,
    initialValues,
  };
}
