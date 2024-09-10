export const isEnrolled = async (slug: string) => {
  const data = await $fetch("/api/enrollment", {
    query: {
      courseSlug: slug,
    },
  });

  return data.enrollment;
};
