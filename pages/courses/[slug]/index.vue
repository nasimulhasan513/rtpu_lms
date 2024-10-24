<template>
  <AppContainer>
    <div class="container px-4 py-8 mx-auto">
      <!-- Course Header -->
      <div class="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
        <div class="md:col-span-2">
          <h1 class="mb-4 text-3xl font-bold">
            {{ course.name }}
          </h1>
          <p class="mb-4 text-lg">{{ courseDetails.forWhom }}</p>
          <div class="flex items-center mb-4">
            <span class="mr-4 text-2xl font-semibold text-primary">
              Tk.{{ course.sale_price }}
            </span>
            <span class="text-lg line-through text-muted-foreground">
              Tk.{{ course.regular_price }}
            </span>
          </div>
          <div class="flex items-center gap-4 mb-4">
            <Button @click="addToCart">Enroll Now</Button>
            <Button variant="outline">Add to Wishlist</Button>
          </div>
        </div>
        <div class="md:col-span-1">
          <img
            :src="course.image"
            :alt="course.name"
            class="w-full rounded-lg shadow-lg"
          />
        </div>
      </div>

      <!-- Course Details -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <!-- Left Column -->
        <div class="md:col-span-2">
          <!-- Promo Video -->
          <div class="mb-8">
            <h2 class="mb-4 text-2xl font-semibold">Course Preview</h2>
            <video
              :src="courseDetails.promoVideo"
              controls
              class="w-full rounded-lg"
            ></video>
          </div>

          <!-- Description -->
          <div class="mb-8">
            <h2 class="mb-4 text-2xl font-semibold">About This Course</h2>
            <div v-html="course.description" class="prose"></div>
          </div>

          <!-- Syllabus -->
          <div class="mb-8">
            <h2 class="mb-4 text-2xl font-semibold">Course Syllabus</h2>
            <ul class="list-disc list-inside">
              <li
                v-for="(module, index) in courseDetails.syllabus"
                :key="index"
                class="mb-2"
              >
                {{ module }}
              </li>
            </ul>
          </div>

          <!-- FAQ -->
          <div class="mb-8">
            <h2 class="mb-4 text-2xl font-semibold">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible class="w-full">
              <AccordionItem
                v-for="(faq, index) in courseDetails.faq"
                :key="index"
                :value="`item-${index}`"
              >
                <AccordionTrigger>{{ faq.question }}</AccordionTrigger>
                <AccordionContent>
                  {{ faq.answer }}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>

        <!-- Right Column -->
        <div class="md:col-span-1">
          <!-- Instructor Info -->
          <Card class="mb-8">
            <CardHeader>
              <CardTitle>Instructors</CardTitle>
            </CardHeader>
            <CardContent>
              <div
                v-for="(teacher, index) in course.teachers"
                :key="index"
                class="flex items-center mb-4"
              >
                <div class="w-20 h-20 mr-4 overflow-hidden rounded-full">
                  <Avatar>
                    <AvatarImage :src="teacher.image" :alt="teacher.name" />
                    <AvatarFallback>{{
                      teacher.image.charAt(0)
                    }}</AvatarFallback>
                  </Avatar>
                </div>
                <div>
                  <h3 class="font-semibold">
                    {{ teacher.name }}
                  </h3>
                  <p class="text-sm text-muted-foreground">
                    {{ teacher.designation }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Course Info -->
          <Card class="mb-8">
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span class="font-semibold">Duration:</span>
                  {{ courseDetails.duration }}
                </div>
                <div>
                  <span class="font-semibold">Lessons:</span>
                  {{ courseDetails.lessons.length }}
                </div>
              </div>
            </CardContent>
          </Card>

          <!-- Course Content -->
          <Card>
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="space-y-2">
                <li
                  v-for="(lesson, index) in courseDetails.lessons"
                  :key="index"
                  class="flex items-center"
                >
                  <Icon
                    :name="lesson.isUnlocked ? 'lucide:unlock' : 'lucide:lock'"
                    class="mr-2"
                  />
                  <span
                    :class="{ 'text-muted-foreground': !lesson.isUnlocked }"
                  >
                    {{ lesson.title }}
                  </span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
    <pre>
      {{ course }}
    </pre>
  </AppContainer>
</template>

<script setup>
import { useToast } from "@/components/ui/toast";

const route = useRoute();
const { toast } = useToast();
const { data: course } = await useFetch(
  `/api/courses/${route.params.slug}/course`
);

// Course details (replace this with actual data fetching logic)
const courseDetails = {
  thumbnail:
    "https://shahriarsirrtpu.s3.ap-southeast-2.amazonaws.com/images/BrSZxWGdBy1715777003.jpg",
  promoVideo: "https://example.com/promo-video.mp4",
  instructor: {
    name: "John Doe",
    designation: "Senior Data Scientist",
    image:
      "https://shahriarsirrtpu.s3.ap-southeast-2.amazonaws.com/images/qoEva51XWu1708938568.png",
  },
  courseName: "Mastering Data Science with Python",
  duration: "12 Weeks",
  forWhom: "Beginners to Intermediate Learners interested in Data Science",
  pricing: {
    originalPrice: 299.99,
    discountedPrice: 199.99,
  },
  lessons: [
    { title: "Introduction to Data Science", isUnlocked: true },
    { title: "Python Basics", isUnlocked: true },
    { title: "Data Manipulation with Pandas", isUnlocked: false },
    { title: "Data Visualization with Matplotlib", isUnlocked: false },
    { title: "Machine Learning Overview", isUnlocked: false },
  ],
  syllabus: [
    "Module 1: Introduction to Data Science",
    "Module 2: Python Programming Fundamentals",
    "Module 3: Data Manipulation and Cleaning",
    "Module 4: Data Visualization Techniques",
    "Module 5: Introduction to Machine Learning",
  ],
  description: `
    <p>In this comprehensive course, you'll gain the essential skills needed to excel in data science.</p>
    <ul>
      <li>Learn Python from scratch</li>
      <li>Work with real-world datasets</li>
      <li>Build machine learning models</li>
      <li>Create insightful visualizations</li>
    </ul>
  `,
  faq: [
    {
      question: "What prerequisites do I need?",
      answer: "Basic knowledge of programming is helpful, but not mandatory.",
    },
    {
      question: "How is this course delivered?",
      answer:
        "The course is a mix of video lectures, quizzes, and hands-on projects.",
    },
    {
      question: "Will I receive a certificate?",
      answer: "Yes, you'll get a certificate upon completing all the lessons.",
    },
  ],
};

const addToCart = () => {
  toast({
    title: "Enrolled Successfully",
    description: `You have been enrolled in ${courseDetails.courseName}.`,
  });
};
</script>

<style lang="scss" scoped>
.prose {
  @apply text-sm leading-relaxed;

  ul {
    @apply list-disc list-inside;
  }
}
</style>
