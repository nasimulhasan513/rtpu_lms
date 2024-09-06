import type { Course } from "@prisma/client";
import { ref, reactive, toRefs } from 'vue'

const state = reactive({
  courses: [] as Course[],
});

export default function useCourse() {
  const { courses } = toRefs(state);

  const fetchCourses = async () => {
    const response = await $fetch("/api/admin/courses");
    state.courses = response.body;
  };

  return {
    courses,
    fetchCourses,
  };
}
