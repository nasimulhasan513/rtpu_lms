import type { Teacher } from "@prisma/client";

const state = reactive({
  isOpen: false,
  initialValues: {} as Teacher,
});

export const useTeachermodal = () => {
  const { isOpen, initialValues } = toRefs(state);

  const onOpen = () => {
    state.isOpen = true;
  };

  const onClose = () => {
    state.isOpen = false;
  };

  const onEdit = (teacher: Teacher) => {
    state.isOpen = true;
    state.initialValues = teacher;
  };

  return {
    initialValues,
    isOpen,
    onOpen,
    onClose,
    onEdit,
  };
};
