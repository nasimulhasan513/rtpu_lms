export default defineEventHandler(async (event) => {
  const slug = event.context.params?.slug

  if (!slug) {
    return {
      status: 400,
      body: { message: "Course slug is required" }
    }
  }

  try {
    const course = await db.course.findUnique({
      where: { slug },
      include: {
        category: true,
        teachers: {
          include: {
            teacher: true
          }
        },
        lessons: {
          include: {
            lesson: true
          }
        }
      }
    })

    if (!course) {
      return {
        status: 404,
        body: { message: "Course not found" }
      }
    }

    // Transform the course data to include teacher information directly
    const transformedCourse = {
      ...course,
      teachers: course.teachers.map(t => t.teacher),
      // You may want to organize lessons into sections here
      content: [
        {
          title: "Course Content",
          lessons: course.lessons.map(l => l.lesson)
        }
      ],
      
    }

    return transformedCourse
  } catch (error) {
    console.error("Error fetching course:", error)
    return {
      status: 500,
      body: { message: "An error occurred while fetching the course" }
    }
  }
})