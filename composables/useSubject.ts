import type { Subject } from "@prisma/client";

const state = reactive({
  isOpen: false,
  subjects: [] as Subject[],
  initialValues: {} as Subject,
});

export default function useSubject() {
  const { isOpen, subjects } = toRefs(state);

  const fetchSubjects = async () => {
    const response = await $fetch("/api/admin/subjects");
    // @ts-ignore
    state.subjects = response.body;
  };

  const onOpen = () => {
    state.isOpen = true;
  };

  const onClose = () => {
    state.isOpen = false;
  };

  const onEdit = (subject: Subject) => {
    state.initialValues = subject;
    state.isOpen = true;
  };

  return {
    isOpen,
    subjects,
    fetchSubjects,
    onOpen,
    onClose,
    onEdit,
  };
}
