<template>
    <div>
        <h1 class="mb-4 text-2xl font-bold">Exams</h1>

        <div class="flex mb-4 space-x-4">
            <Select v-model="selectedCourse" class="w-48">
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Course" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Courses</SelectItem>
                    <SelectItem v-for="course in courses" :key="course.id" :value="course.id">
                        {{ course.name }}
                    </SelectItem>
                </SelectContent>
            </Select>

            <Select v-model="selectedSubject" class="w-48">
                <SelectTrigger>
                    <SelectValue placeholder="Filter by Subject" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">All Subjects</SelectItem>
                    <SelectItem v-for="subject in subjects" :key="subject.id" :value="subject.id">
                        {{ subject.name }}
                    </SelectItem>
                </SelectContent>
            </Select>
        </div>
        <div class="bg-white">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Courses</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Start Time</TableHead>
                        <TableHead>End Time</TableHead>
                        <TableHead>Duration</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="exam in data.body" :key="exam.id">
                        <TableCell>{{ exam.title }}</TableCell>
                        <TableCell>{{ exam.courseExams?.map(course => course.course.name).join(', ') }}</TableCell>
                        <TableCell>{{ exam.subject.name }}</TableCell>
                        <TableCell>{{ formatDate(exam.startTime) }}</TableCell>
                        <TableCell>{{ formatDate(exam.endTime) }}</TableCell>
                        <TableCell>{{ exam.duration }} minutes</TableCell>
                        <TableCell>
                            <div class="flex items-center space-x-2">
                                <Button @click="viewQuestions(exam.id)" variant="outline" size="sm">
                                    <Icon name="lucide:list" />
                                </Button>
                                <Button @click="viewLeaderboard(exam.id)" variant="outline" size="sm">
                                    <Icon name="lucide:trophy" />
                                </Button>
                                <Button @click="editExam(exam.id)" variant="outline" size="sm">
                                    <Icon name="lucide:edit" />
                                </Button>
                                <Button @click="deleteExam(exam.id)" variant="destructive" size="sm">
                                    <Icon name="lucide:trash-2" />
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useToast } from '~/components/ui/toast/use-toast';

definePageMeta({
    layout: "admin",
});

const { toast } = useToast();
const selectedCourse = ref('');
const selectedSubject = ref('');

const { data, refresh: refreshExams } = useFetch('/api/admin/exams', {
    query: computed(() => ({
        courseId: selectedCourse.value,
        subjectId: selectedSubject.value,
    })),
});

const { courses, fetchCourses } = useCourse();
const { subjects, fetchSubjects } = useSubject();
onMounted(async () => {
    await fetchSubjects();
    await fetchCourses();
})

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};

const editExam = (examId) => {
    navigateTo(`/admin/exams/${examId}/edit`);
};

const deleteExam = async (examId) => {
    if (confirm('Are you sure you want to delete this exam?')) {
        try {
            await $fetch(`/api/admin/exams/${examId}`, { method: 'DELETE' });
            toast({
                title: 'Exam deleted successfully',
            });
            refreshExams();
        } catch (error) {
            console.error('Error deleting exam:', error);
            toast({
                title: 'Failed to delete exam',
                variant: 'destructive'
            });
        }
    }
};


const viewQuestions = (examId) => {
    navigateTo(`/admin/exams/${examId}/questions`);
};

const viewLeaderboard = (examId) => {
    navigateTo(`/admin/exams/${examId}/leaderboard`);
};


</script>