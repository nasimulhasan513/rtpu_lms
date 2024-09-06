const state = reactive({
  isOpen: false,
  initialQuestion: null,
  examId: null,
});

export default function useExam() {
  const { isOpen, initialQuestion, examId } = toRefs(state);

  const onEdit = (question) => {
    state.initialQuestion = question;
    state.isOpen = true;
  };

  const onOpen = (examId) => {
    state.isOpen = true;
    state.examId = examId;
  };

  const onClose = () => {
    state.isOpen = false;
    state.initialQuestion = null;
  };

  return {
    initialQuestion,
    examId,
    isOpen,
    onEdit,
    onOpen,
    onClose,
  };
}
