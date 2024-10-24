<template>
  <AppContainer>
    <div class="container px-4 py-8 mx-auto">
      <!-- Course Header -->
      <div class="grid min-h-screen grid-cols-1 gap-8 mb-12 md:grid-cols-3">
        <div class="overflow-y-auto md:col-span-2">
          <h1 class="mb-4 text-3xl font-bold">
            {{ courseData.name }}
          </h1>




          <!-- Instructor Info -->
          <Card class="mb-8">
            <CardHeader>
              <CardTitle>শিক্ষকবৃন্দ</CardTitle>
            </CardHeader>
            <CardContent>
              <div class="flex items-center mb-4" v-for="instructor in courseData.teachers" :key="instructor.id">
                <Avatar class="w-16 h-16 mr-4">
                  <AvatarImage :src="instructor.image" :alt="instructor.name" />
                  <AvatarFallback>{{
                    instructor.name.charAt(0)
                  }}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 class="font-semibold">{{ instructor.name }}</h3>
                  <p class="text-sm text-muted-foreground">
                    {{ instructor.designation }}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          <!-- Course Includes -->
          <Card class="mb-8">
            <CardHeader>
              <CardTitle>This course includes:</CardTitle>
            </CardHeader>
            <CardContent>
              <ul class="grid grid-cols-2 gap-4">
                <li v-for="(item, index) in course.includes" :key="index" class="flex items-center">
                  <Icon :name="item.icon" class="w-5 h-5 mr-2 text-primary" />
                  <span>{{ item.text }}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          <!-- Course Details -->
          <div class="mb-6 prose" v-html="courseData.description"></div>
          <!-- Left Column -->
          <div class="md:col-span-2">
            <!-- Course Content -->
            <Card class="mb-8">
              <CardHeader>
                <CardTitle>Course Content</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible class="w-full">
                  <AccordionItem v-for="(week, index) in course.weeks" :key="index" :value="`week-${index + 1}`">
                    <AccordionTrigger>{{ week.title }}</AccordionTrigger>
                    <AccordionContent>
                      <ul class="space-y-2">
                        <li v-for="(lesson, lessonIndex) in week.lessons" :key="lessonIndex" class="flex items-center">
                          <Icon :name="lesson.icon" class="w-5 h-5 mr-2 text-muted-foreground" />
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
                <AccordionItem v-for="(faq, index) in course.faq" :key="index" :value="`item-${index}`">
                  <AccordionTrigger>{{ faq.question }}</AccordionTrigger>
                  <AccordionContent>
                    {{ faq.answer }}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>


        </div>
        <div class="md:col-span-1">
          <div class="sticky p-4 border rounded-md top-24">
            <div>
              <img :src="courseData.image" :alt="courseData.name" class="w-full mb-4 rounded-lg" />

              <div class="flex items-center mb-4">
                <Icon name="lucide:users" class="w-5 h-5 mr-2 text-muted-foreground" />
                <span class="text-sm text-muted-foreground">{{ courseData.enrolled }} students enrolled</span>
              </div>

              <div class="flex items-center mb-4">
                <Icon name="lucide:clock" class="w-5 h-5 mr-2 text-muted-foreground" />
                <span class="text-sm text-muted-foreground">{{ courseData.duration }} Months</span>
              </div>

              <div class="flex items-center justify-between mb-4">
                <span class="text-3xl font-semibold text-primary">
                  Tk. {{ courseData.sale_price }}
                </span>
                <span class="text-lg line-through text-muted-foreground">
                  Tk. {{ courseData.regular_price }}
                </span>
              </div>



              <div class="flex items-center mb-4">
                <Input v-model="promoCode" placeholder="Enter promo code" class="mr-2" />
                <Button variant="outline" @click="applyPromoCode">
                  Apply
                </Button>
              </div>

              <AppButton :label="`এখনই কিনুন`" class="w-full" />
            </div>
          </div>
        </div>
      </div>


    </div>
  </AppContainer>
</template>

<script setup>
import { useToast } from "@/components/ui/toast";
import { ref } from 'vue';

const route = useRoute();
const { toast } = useToast();

const promoCode = ref('');


const { data: courseData } = useFetch(`/api/courses/${route.params.slug}`);


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

const purchase = () => {
  // Implement purchase logic
  toast({
    title: "Purchase initiated",
    description: "Redirecting to payment gateway...",
  });
};

const applyPromoCode = () => {
  // Implement promo code logic
  toast({
    title: "Promo code applied",
    description: `Promo code "${promoCode.value}" has been applied.`,
  });
};

const enroll = () => {
  // Implement enrollment logic
  toast({
    title: "Enrollment successful",
    description: "You have been enrolled in the course.",
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
