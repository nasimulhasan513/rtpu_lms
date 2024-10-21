<template>
  <AppContainer>
    <h1 class="mb-6 text-3xl font-bold">Update Exam</h1>

    <form @submit="onSubmit" class="space-y-6">
      <FormField v-slot="{ field }" name="title">
        <FormItem>
          <FormLabel>Title</FormLabel>
          <FormControl>
            <Input v-bind="field" placeholder="Enter exam title" />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="courses">
        <FormItem>
          <FormLabel>Select Courses</FormLabel>
          <FormControl>
            <div class="grid grid-cols-3 gap-3 p-3 bg-white border rounded-md">
              <div
                v-for="(course, index) in courseOptions"
                :key="course.value"
                class="flex items-center space-x-2"
              >
                <Checkbox
                  :id="course.value"
                  :checked="course.selected"
                  @click="chooseCourse(index)"
                />
                <label
                  :for="course.value"
                  class="text-sm font-medium cursor-pointer"
                >
                  {{ course.label }}
                </label>
              </div>
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <FormField v-slot="{ field }" name="subjectId">
        <FormItem>
          <FormLabel>Subject</FormLabel>
          <Select v-bind="field" v-model="form.values.subjectId">
            <FormControl>
              <SelectTrigger class="bg-white dark:bg-slate-800">
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              <SelectGroup>
                <SelectItem
                  v-for="subject in subjects"
                  :key="subject.id"
                  :value="subject.id"
                >
                  {{ subject.name }}
                </SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      </FormField>
      <FormField v-slot="{ field }" name="description">
        <FormItem>
          <FormLabel>Description</FormLabel>
          <FormControl>
            <Textarea
              v-bind="field"
              placeholder="Enter exam description/instructions/syllabus"
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      </FormField>

      <div class="grid grid-cols-2 gap-4">
        <FormField v-slot="{ field }" name="duration">
          <FormItem>
            <FormLabel>Duration (minutes)</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                type="number"
                min="1"
                placeholder="Enter duration"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="totalMarks">
          <FormItem>
            <FormLabel>Total Marks</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                type="number"
                min="1"
                placeholder="Enter total marks"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="grid grid-cols-2 gap-4">
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
      </div>

      <div class="grid grid-cols-2 gap-4">
        <FormField v-slot="{ field }" name="resultPublishTime">
          <FormItem>
            <FormLabel>Result Publish Time</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                type="datetime-local"
                :disabled="form.values.instantResult"
              />
            </FormControl>
            <FormDescription>
              {{
                form.values.instantResult
                  ? "Set to End Time when Instant Result is enabled"
                  : "Automatically set to End Time + Duration"
              }}
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>

        <FormField v-slot="{ field }" name="passMarks">
          <FormItem>
            <FormLabel>Pass Marks</FormLabel>
            <FormControl>
              <Input
                v-bind="field"
                type="number"
                min="1"
                placeholder="Enter pass marks"
              />
            </FormControl>
            <FormDescription>
              The pass marks will be calculated for each subject based on the
              total marks of that subject.
            </FormDescription>
            <FormMessage />
          </FormItem>
        </FormField>
      </div>

      <div class="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        <FormField v-slot="{ field }" name="instantResult">
          <FormItem
            class="flex flex-row items-start p-4 space-x-3 space-y-0 bg-white border rounded-md dark:bg-slate-800"
          >
            <FormControl>
              <Checkbox
                :checked="form.values.instantResult"
                @click="
                  form.setFieldValue(
                    'instantResult',
                    !form.values.instantResult
                  )
                "
              />
            </FormControl>
            <div class="space-y-1 leading-none">
              <FormLabel> Instant Result </FormLabel>
              <FormDescription>
                Show result immediately after exam completion
              </FormDescription>
            </div>
          </FormItem>
        </FormField>
        <FormField v-slot="{ field }" name="negativeMarking">
          <FormItem
            class="flex flex-row items-start p-4 space-x-3 space-y-0 bg-white border rounded-md dark:bg-slate-800"
          >
            <FormControl>
              <Checkbox
                :checked="form.values.negativeMarking"
                @click="
                  form.setFieldValue(
                    'negativeMarking',
                    !form.values.negativeMarking
                  )
                "
              />
            </FormControl>
            <div class="space-y-1 leading-none">
              <FormLabel> Negative Marking </FormLabel>
              <FormDescription>
                Apply negative marking for incorrect answers
              </FormDescription>
            </div>
          </FormItem>
        </FormField>
        <FormField v-slot="{ field }" name="shuffleQuestion">
          <FormItem
            class="flex flex-row items-start p-4 space-x-3 space-y-0 bg-white border rounded-md dark:bg-slate-800"
          >
            <FormControl>
              <Checkbox
                :checked="form.values.shuffleQuestion"
                @click="
                  form.setFieldValue(
                    'shuffleQuestion',
                    !form.values.shuffleQuestion
                  )
                "
              />
            </FormControl>
            <div class="space-y-1 leading-none">
              <FormLabel> Shuffle Question </FormLabel>
              <FormDescription>
                Shuffle question order for each student
              </FormDescription>
            </div>
          </FormItem>
        </FormField>
      </div>

      <Button type="submit" class="w-full">Update Exam</Button>
    </form>
  </AppContainer>
</template>

<script setup>
import { useToast } from "~/components/ui/toast/use-toast";
import { examSchema } from "~/schema/exam.schema";
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { ref, watch } from "vue";
import { useRoute } from "vue-router";

definePageMeta({
  layout: "ADMIN",
});

const { subjects, fetchSubjects } = useSubject();
const { courses: courseOptions, fetchCourses } = useCourse();
const { toast } = useToast();
const route = useRoute();
const examId = route.params.id;

const formSchema = toTypedSchema(examSchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    title: "",
    courses: [],
    subjectId: "",
    description: "",
    startTime: "",
    endTime: "",
    duration: 0,
    totalMarks: 0,
    passMarks: 0,
    resultPublishTime: "",
    instantResult: false,
    negativeMarking: false,
    shuffleQuestion: false,
  },
});

// Fetch exam data
const fetchExamData = async () => {
  try {
    const exam = await $fetch(`/api/admin/exams/${examId}`);
    console.log(exam);
    form.setValues({
      ...exam,
      description: exam.description || "",
      courses: exam.courseExams.map((ce) => ce.course.id),
      startTime: inputFormat(exam.startTime),
      endTime: inputFormat(exam.endTime),
      resultPublishTime: inputFormat(exam.resultPublishTime || exam.endTime),
      instantResult: exam.instantResult,
      negativeMarking: exam.negativeMarking,
    });

    courseOptions.value = courseOptions.value.map((course) => ({
      label: course.name,
      value: course.id,
      selected: exam.courseExams.some((ce) => ce.course.id === course.id),
    }));
  } catch (error) {
    console.error("Error fetching exam data:", error);
    toast({
      title: "Failed to fetch exam data",
      variant: "destructive",
    });
  }
};

const subjectOptions = computed(() =>
  subjects.value.map((subject) => ({ label: subject.name, value: subject.id }))
);
const chooseCourse = (index) => {
  courseOptions.value[index].selected = !courseOptions.value[index].selected;
  let selectedCourses = courseOptions.value
    .filter((course) => course.selected)
    .map((course) => course.value);
  form.setFieldValue("courses", selectedCourses);
};

onMounted(async () => {
  await fetchSubjects();
  await fetchCourses();
  await fetchExamData();
});

// Add watch for endTime, duration, and instantResult
watch(
  [
    () => form.values.endTime,
    () => form.values.duration,
    () => form.values.instantResult,
  ],
  ([newEndTime, newDuration, newInstantResult]) => {
    if (newEndTime) {
      const endDateTime = new Date(newEndTime);
      let publishDateTime;

      if (newInstantResult) {
        publishDateTime = endDateTime;
      } else if (newDuration) {
        publishDateTime = new Date(endDateTime.getTime() + newDuration * 60000);
      } else {
        return; // If no duration and not instant result, don't update
      }

      const formattedPublishTime = inputFormat(publishDateTime);
      form.setFieldValue("resultPublishTime", formattedPublishTime);
      form.setFieldValue("solutionPublishTime", formattedPublishTime);
    }
  }
);

const onSubmit = form.handleSubmit(async (values) => {
  try {
    const response = await $fetch(`/api/admin/exams/${examId}`, {
      method: "PUT",
      body: values,
    });
    toast({
      title: "Exam updated successfully",
    });
    navigateTo("/admin/exams");
  } catch (error) {
    toast({
      title: "Failed to update exam",
      variant: "destructive",
    });
    console.error("Error updating exam:", error);
  }
});
</script>

<style lang="scss" scoped></style>
