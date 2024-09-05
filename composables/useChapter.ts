import type { Chapter, Subject } from "@prisma/client";

const state = reactive({
  isOpen: false,
  initialValues: {} as Subject,
});

export default function useChapter() {
  const { isOpen, initialValues } = toRefs(state);

  const onOpen = (subjectId: string) => {
    state.isOpen = true;
    state.initialValues = {
      // @ts-ignore
      subjectId,
    };
  };

  const onClose = () => {
    state.isOpen = false;
  };

  const onEdit = (chapter: Chapter) => {
    state.initialValues = chapter;
    state.isOpen = true;
  };

  return {
    isOpen,
    initialValues,
    onOpen,
    onClose,
    onEdit,
  };
}
