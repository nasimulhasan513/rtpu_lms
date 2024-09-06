<template>
    <AppContainer>
        <div class="container px-4 py-8 mx-auto">
            <div v-if="course" class="flex flex-col gap-8 lg:flex-row">
                <!-- Left side: Course details -->
                <div class="w-full space-y-8 lg:w-2/3">
                    <div class="space-y-4">
                        <h1 class="text-3xl font-bold">{{ course.name }}</h1>
                        <p class="text-lg text-gray-600">{{ course.short_description }}</p>
                        <div class="space-y-4">
                            <h2 class="text-2xl font-semibold">Instructors</h2>
                            <div class="space-y-6">
                                <div v-for="teacher in course.teachers" :key="teacher.id" class="flex space-x-4">
                                    <img :src="teacher.image" :alt="teacher.name" class="w-20 h-20 rounded-full">
                                    <div>
                                        <p class="font-semibold">{{ teacher.name }}</p>
                                        <p class="text-sm text-gray-600">{{ teacher.designation }}</p>
                                        <p class="mt-2 text-sm text-gray-700">{{ teacher.bio }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-semibold">What you'll learn</h2>
                        <ul class="grid grid-cols-1 gap-2 md:grid-cols-2">
                            <li v-for="(point, index) in course.learning_points" :key="index"
                                class="flex items-start space-x-2">
                                <Icon name="mdi:check-circle" class="flex-shrink-0 w-5 h-5 text-green-500" />
                                <span>{{ point }}</span>
                            </li>
                        </ul>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-semibold">Course Content</h2>
                        <Accordion type="single" collapsible class="w-full">
                            <AccordionItem v-for="(section, index) in course.content" :key="index"
                                :value="`section-${index}`">
                                <AccordionTrigger>
                                    <div class="flex items-center justify-between w-full">
                                        <span>{{ section.title }}</span>
                                        <span class="text-sm text-gray-500">{{ section.lessons.length }} lessons</span>
                                    </div>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul class="space-y-2">
                                        <li v-for="(lesson, lessonIndex) in section.lessons" :key="lessonIndex"
                                            class="flex items-center space-x-2 text-gray-700">
                                            <Icon name="mdi:play-circle" class="w-5 h-5 text-primary" />
                                            <span>{{ lesson.title }}</span>
                                        </li>
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </div>

                    <div class="space-y-4">
                        <h2 class="text-2xl font-semibold">Course Description</h2>
                        <p class="text-gray-700">{{ course.description }}</p>
                    </div>


                </div>

                <!-- Right side: Course enrollment (fixed on scroll) -->
                <div class="w-full lg:w-1/3">
                    <div class="sticky p-6 space-y-6 bg-white rounded-lg shadow-md top-24">
                        <img :src="course.image" :alt="course.name" class="w-full h-auto rounded-lg shadow-lg">
                        <div class="space-y-4">
                            <div class="flex items-center justify-between">
                                <p class="text-3xl font-bold text-primary">৳{{ course.sale_price }}</p>
                                <p class="text-xl text-gray-500 line-through">৳{{ course.regular_price }}</p>
                            </div>
                            <Button class="w-full" size="lg" @click="openEnrollmentModal">Enroll Now</Button>
                            <div class="text-center">
                                <p class="text-sm text-gray-600">{{ course.enrolled }} students enrolled</p>
                            </div>
                        </div>
                        <div class="space-y-2">
                            <div class="flex items-center space-x-2">
                                <Icon name="mdi:clock" class="w-5 h-5 text-gray-500" />
                                <span>{{ course.duration }} total hours</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Icon name="mdi:video" class="w-5 h-5 text-gray-500" />
                                <span>{{ course.content.reduce((acc, section) => acc + section.lessons.length, 0) }}
                                    lessons</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Icon name="mdi:infinity" class="w-5 h-5 text-gray-500" />
                                <span>Full lifetime access</span>
                            </div>
                            <div class="flex items-center space-x-2">
                                <Icon name="mdi:certificate" class="w-5 h-5 text-gray-500" />
                                <span>Certificate of completion</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div v-else-if="error" class="text-center text-red-500">
                {{ error }}
            </div>

            <div v-else class="text-center">
                <p>Loading course details...</p>
            </div>

            <EnrollmentModal
                :is-open="isEnrollmentModalOpen"
                :course-id="course?.id"
                @close="closeEnrollmentModal"
                @enrolled="handleEnrollmentSuccess"
            />
        </div>
    </AppContainer>
</template>

<script setup>
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'
import EnrollmentModal from '@/components/Course/EnrollmentModal.vue'

const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const { data: course, error } = await useFetch(`/api/courses/${route.params.slug}`)

if (error.value) {
    toast({
        title: 'Error',
        description: 'Failed to load course details. Please try again later.',
        variant: 'destructive'
    })
}

const isEnrollmentModalOpen = ref(false)

const openEnrollmentModal = () => {
    isEnrollmentModalOpen.value = true
}

const closeEnrollmentModal = () => {
    isEnrollmentModalOpen.value = false
}

const handleEnrollmentSuccess = () => {
    // Redirect to the course dashboard
    router.push(`/courses/${route.params.slug}/dashboard`)
}
</script>