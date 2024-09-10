const state = reactive({
  teachers: [],
  loading: false,
  error: null,
});

export const useTeachers = () => {
  const { teachers, loading, error } = toRefs(state);

  const getTeachers = async () => {
    state.loading = true;
    try {
      const response = await $fetch("/api/admin/teachers");
      state.teachers = response;
    } catch (error) {
      state.error = error;
    }
  };

  return {
    teachers,

    loading,
    error,
    getTeachers,
  };
};
