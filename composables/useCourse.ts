import type { Course } from "@prisma/client";
import { ref, reactive, toRefs } from "vue";

const state = reactive({
  courses: [] as Course[],
  course: {} as Course,
});

export default function useCourse() {
  const { courses, course } = toRefs(state);

  const fetchCourses = async () => {
    const response = await $fetch("/api/admin/courses");
    state.courses = response.body;
  };

  const fetchCourse = async (slug: string) => {
    const response = await $fetch(`/api/courses/${slug}`);
    state.course = response;
  };

  return {
    courses,
    course,
    fetchCourses,
    fetchCourse,
  };
}
