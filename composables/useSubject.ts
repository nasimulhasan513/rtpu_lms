import type { Course } from "@prisma/client";

const state = reactive({
  isOpen: false,
  initialValues: {} as Course,
});

export default function useSubject() {
  const { isOpen } = toRefs(state);

  const onOpen = () => {
    state.isOpen = true;
  };

  const onClose = () => {
    state.isOpen = false;
  };

  const onEdit = (course: Course) => {
    state.initialValues = course;
    state.isOpen = true;
  };

  return {
    isOpen,
    onOpen,
    onClose,
    onEdit,
  };
}
