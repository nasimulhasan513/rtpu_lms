<template>
  <AppContainer>
    <div class="container px-4 py-8 mx-auto">
      <!-- Course Header -->
      <div class="grid grid-cols-1 gap-8 mb-12 md:grid-cols-3">
        <div class="md:col-span-2 overflow-y-auto max-h-screen">
          <h1 class="mb-4 text-3xl font-bold">
            {{ course.name }}
          </h1>
          <div class="flex items-center mb-4">
            <div class="flex items-center mr-4">
              <Icon name="lucide:star" class="w-5 h-5 text-yellow-400" />
              <span class="ml-1 font-semibold">{{ course.rating }}</span>
            </div>
            <span class="text-sm text-muted-foreground"
              >({{ course.ratingCount }} ratings)</span
            >
          </div>
          <p class="mb-4 text-sm text-muted-foreground">
            {{ course.studentCount }} students
          </p>
          <p class="mb-4">
            Created by
            <span class="font-semibold">{{ course.instructor }}</span>
          </p>
          <p class="mb-6 text-lg">{{ course.description }}</p>
          <!-- Instructor Info -->
          <Card class="mb-8">
            <CardHeader>
              <CardTitle>Instructor</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center mb-4">
                <Avatar class="w-16 h-16 mr-4">
                  <AvatarImage
                    :src="course.instructorImage"
                    :alt="course.instructor"
                  />
                  <AvatarFallback>{{
                    course.instructor.charAt(0)
                  }}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 class="font-semibold">{{ course.instructor }}</h3>
                  <p class="text-sm text-muted-foreground">
                    {{ course.instructorTitle }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div class="md:col-span-1 relative sticky top-0">
          <div class="md:col-span-1 border p-5 border-red-700">
            <img
              :src="course.image"
              :alt="course.name"
              class="w-full rounded-lg shadow-lg"
            />

            <div class="flex items-center gap-4 justify-end pt-4">
              <div class="flex items-center mb-4">
                <span class="mr-4 text-3xl font-semibold text-primary">
                  ${{ course.salePrice }}
                </span>
                <span class="text-lg line-through text-muted-foreground">
                  ${{ course.regularPrice }}
                </span>
                <span class="ml-2 text-sm font-semibold text-green-600">
                  ({{ course.discount }}% off)
                </span>
              </div>
              <Button
                @click="addToCart"
                class="px-8 py-6 text-lg text-white font-semibold bg-purple-600 hover:bg-purple-700"
              >
                Buy Now
              </Button>
            </div>
            <div class="md:col-span-1 pt-6">
              <Card class="mb-8">
                <CardHeader>
                  <CardTitle>Course Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div class="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span class="font-semibold">Duration:</span>
                      {{ course.duration }}
                    </div>
                    <div>
                      <span class="font-semibold">Lessons:</span>
                      {{ course.totalLessons }}
                    </div>
                    <div>
                      <span class="font-semibold">Level:</span>
                      {{ course.level }}
                    </div>
                    <div>
                      <span class="font-semibold">Language:</span>
                      {{ course.language }}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <!-- Course Details -->
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <!-- Left Column -->
        <div class="md:col-span-2">
          <!-- Course Content -->
          <Card class="mb-8">
            <CardHeader>
              <CardTitle>Course Content</CardTitle>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible class="w-full">
                <AccordionItem
                  v-for="(week, index) in course.weeks"
                  :key="index"
                  :value="`week-${index + 1}`"
                >
                  <AccordionTrigger>{{ week.title }}</AccordionTrigger>
                  <AccordionContent>
                    <ul class="space-y-2">
                      <li
                        v-for="(lesson, lessonIndex) in week.lessons"
                        :key="lessonIndex"
                        class="flex items-center"
                      >
                        <Icon
                          :name="lesson.icon"
                          class="w-5 h-5 mr-2 text-muted-foreground"
                        />
                        <span>{{ lesson.title }}</span>
                        <span class="ml-auto text-sm text-muted-foreground">{{
                          lesson.duration
                        }}</span>
                      </li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>

          <!-- Course Includes -->
          <Card class="mb-8">
            <CardHeader>
              <CardTitle>This course includes:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="grid grid-cols-2 gap-4">
                <li
                  v-for="(item, index) in course.includes"
                  :key="index"
                  class="flex items-center"
                >
                  <Icon :name="item.icon" class="w-5 h-5 mr-2 text-primary" />
                  <span>{{ item.text }}</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <!-- Description -->
          <div class="mb-8">
            <h2 class="mb-4 text-2xl font-semibold">About This Course</h2>
            <div v-html="course.description" class="prose"></div>
          </div>

          <!-- FAQ -->
          <div class="mb-8">
            <h2 class="mb-4 text-2xl font-semibold">
              Frequently Asked Questions
            </h2>
            <Accordion type="single" collapsible class="w-full">
              <AccordionItem
                v-for="(faq, index) in course.faq"
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
          <!-- Course Info -->
        </div>
      </div>
    </div>
  </AppContainer>
</template>

<script setup>
import { useToast } from "@/components/ui/toast";

const route = useRoute();
const { toast } = useToast();

// Simulated course data (replace with actual API call)
const course = ref({
  name: "The Complete Advanced 6-Week UI/UX Design Bootcamp",
  rating: 4.9,
  ratingCount: 264250,
  studentCount: "1,936,922",
  instructor: "Dr. Marley Bator",
  instructorTitle: "Senior UX Designer & Educator",
  instructorImage: "https://example.com/instructor-image.jpg",
  instructorBio:
    "Dr. Marley Bator is a renowned UX designer with over 15 years of experience in the field...",
  description:
    "Our 6-week UI/UX bootcamp equips students with the essential skills to become successful designers. The course provides hands-on learning opportunities to design and prototype digital products, conduct user research, and create user flows and wireframes.",
  regularPrice: 3499,
  salePrice: 549,
  discount: 85,
  image:
    "https://www.gkftii.com/blog/img/multimedia-courses-scope-and-career.webp",
  duration: "6 weeks",
  totalLessons: 42,
  level: "Advanced",
  language: "English",
  weeks: [
    {
      title: "Week 1: Beginner - Introduction to UX Designing",
      lessons: [
        {
          title: "Introduction to Figma Essentials",
          duration: "02:45",
          icon: "lucide:play",
        },
        {
          title: "What is the difference between UI & UX in Figma",
          duration: "05:22",
          icon: "lucide:play",
        },
        {
          title: "Project: 'Create Your Own Brief'",
          duration: "",
          icon: "lucide:file-text",
        },
      ],
    },
    { title: "Week 2: Beginner - Welcome to Course 1", lessons: [] },
    {
      title: "Week 3: Beginner - The basics of user experience design",
      lessons: [],
    },
    { title: "Week 4: Beginner - Getting started in UX design", lessons: [] },
    { title: "Week 5: Jobs in the field of user experience", lessons: [] },
    { title: "Week 6: Getting ahead as a junior designer", lessons: [] },
  ],
  includes: [
    { text: "65 hours of on-demand video", icon: "lucide:video" },
    { text: "49 downloadable resources", icon: "lucide:download" },
    { text: "Mobile and TV access", icon: "lucide:smartphone" },
    { text: "86 articles", icon: "lucide:file-text" },
    { text: "8 coding exercises", icon: "lucide:code" },
    { text: "Certificate of completion", icon: "lucide:award" },
  ],
  faq: [
    {
      question: "What prerequisites do I need?",
      answer:
        "Basic knowledge of design principles is helpful, but not mandatory. This course is designed for both beginners and those with some experience in UI/UX design.",
    },
    {
      question: "How is this course delivered?",
      answer:
        "The course is delivered through a combination of video lectures, hands-on projects, quizzes, and peer reviews. You'll have access to a dedicated online learning platform where you can interact with instructors and fellow students.",
    },
    {
      question: "Will I receive a certificate?",
      answer:
        "Yes, upon successful completion of the course and all required projects, you'll receive a certificate of completion that you can share on your portfolio or LinkedIn profile.",
    },
  ],
});

const addToCart = () => {
  toast({
    title: "Added to Cart",
    description: `${course.value.name} has been added to your cart.`,
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
