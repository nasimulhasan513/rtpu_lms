<template>
    <AppContainer>
        <h1 class="mb-4 text-2xl font-bold">Create Exam</h1>

        <form @submit="onSubmit" class="space-y-4">
            <FormField v-slot="{ field }" name="title">
                <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                        <Input v-bind="field" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>


            <div class="space-y-2">

                <p>
                    Select Courses
                </p>

                <div class="grid grid-cols-3 gap-2 p-2 bg-white border rounded-md">
                    <div v-for="(course, index) in courseOptions" class="flex items-center space-x-2">
                        <Checkbox :checked="course.selected" @click="chooseCourse(index)" />
                        <label for="terms"
                            class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                            {{ course.label }}
                        </label>
                    </div>
                </div>

            </div>


            <FormField v-slot="{ field }" name="subjectId">
                <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                        <Select v-bind="field" class="bg-white">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a subject" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup>
                                    <SelectItem v-for="subject in subjectOptions" :key="subject.value"
                                        :value="subject.value">
                                        {{ subject.label }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </FormControl>
                    <FormMessage />
                </FormItem>
            </FormField>

            <div class="grid grid-cols-2 gap-2">
                <FormField v-slot="{ field }" name="duration">
                    <FormItem>
                        <FormLabel>Duration (minutes)</FormLabel>
                        <FormControl>
                            <Input v-bind="field" type="number" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ field }" name="totalMarks">
                    <FormItem>
                        <FormLabel>Total Marks</FormLabel>
                        <FormControl>
                            <Input v-bind="field" type="number" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>

            <div class="grid grid-cols-2 gap-2">
                <FormField v-slot="{ field }" name="startTime">
                    <FormItem>
                        <FormLabel>Start Time</FormLabel>
                        <FormControl>
                            <Input v-bind="field" type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ field }" name="endTime">
                    <FormItem>
                        <FormLabel>End Time</FormLabel>
                        <FormControl>
                            <Input v-bind="field" type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>



                <FormField v-slot="{ field }" name="resultPublishTime">
                    <FormItem>
                        <FormLabel>Result Publish Time</FormLabel>
                        <FormControl>
                            <Input v-bind="field" type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-slot="{ field }" name="solutionPublishTime">
                    <FormItem>
                        <FormLabel>Solution Publish Time</FormLabel>
                        <FormControl>
                            <Input v-bind="field" type="datetime-local" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>

            <Button type="submit" class="mt-4">Create Exam</Button>
        </form>
    </AppContainer>
</template>

<script setup>

import { useToast } from '~/components/ui/toast/use-toast';

import { z } from 'zod';
import { useForm } from 'vee-validate';
import { toTypedSchema } from '@vee-validate/zod';
import { ref, watch } from 'vue';

definePageMeta({
    layout: "admin",
});

const { subjects, fetchSubjects } = useSubject();
const { courses, fetchCourses } = useCourse();
const { toast } = useToast();

const formSchema = toTypedSchema(z.object({
    title: z.string().min(1, 'Title is required'),
    courses: z.array(z.string()).min(1, 'At least one course is required'),
    subjectId: z.string().min(1, 'Subject is required'),
    startTime: z.string().min(1, 'Start time is required'),
    endTime: z.string().min(1, 'End time is required'),
    duration: z.number().min(1, 'Duration must be at least 1 minute'),
    totalMarks: z.number().min(1, 'Total marks must be at least 1'),
    resultPublishTime: z.string().min(1, 'Result publish time is required'),
    solutionPublishTime: z.string().min(1, 'Solution publish time is required'),
}));

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        title: '',
        courses: [],
        subjectId: '',
        startTime: '',
        endTime: '',
        duration: 0,
        totalMarks: 0,
        resultPublishTime: '',
        solutionPublishTime: '',
    },
});
const courseOptions = ref([]);

const subjectOptions = computed(() =>
    subjects.value.map(subject => ({ label: subject.name, value: subject.id }))
);

const chooseCourse = (index) => {
    courseOptions.value[index].selected = !courseOptions.value[index].selected;
    let selectedCourses = courseOptions.value.filter(course => course.selected).map(course => course.value);
    console.log(selectedCourses);
    form.setFieldValue('courses', selectedCourses);
}

watch(courses, (newValue) => {
    courseOptions.value = newValue.map(course => ({ label: course.name, value: course.id, selected: false }));
});

// on change endtime set resultPublishTime and solutionPublishTime
watch(form.values.endTime, (newValue) => {
    form.setFieldValue('resultPublishTime', newValue);
    form.setFieldValue('solutionPublishTime', newValue);
});


onMounted(async () => {
    await fetchSubjects();
    await fetchCourses();
});

const onSubmit = form.handleSubmit(async (values) => {
    try {
        const response = await $fetch('/api/admin/exams', {
            method: 'POST',
            body: values,
        });
        toast({
            title: 'Exam created successfully',

        });
        navigateTo('/admin/exams');
    } catch (error) {
        toast({
            title: 'Failed to create exam',
            variant: 'destructive'
        });
        console.error('Error creating exam:', error);
    }
});
</script>

<style lang="scss" scoped></style>