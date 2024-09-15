<template>
    <div class="p-6">
        <h1 class="mb-4 text-2xl font-bold">Assignment Submissions</h1>
        <div v-if="status === 'success' && submissions && submissions.length > 0">
            <Table class="bg-white">
                <TableHeader>
                    <TableRow>
                        <TableHead>Student Name</TableHead>
                        <TableHead>Submitted At</TableHead>
                        <TableHead>Grade</TableHead>
                        <TableHead>Feedback</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    <TableRow v-for="submission in submissions" :key="submission.id">
                        <TableCell>{{ submission.user.name }}</TableCell>
                        <TableCell>{{ formatDate(submission.submittedAt) }}</TableCell>
                        <TableCell>{{ submission.grade ?? 'Not graded' }}</TableCell>
                        <TableCell>{{ submission.feedback ?? 'No feedback yet' }}</TableCell>
                        <TableCell>
                            <Button @click="evaluateSubmission(submission.id)">Evaluate</Button>
                        </TableCell>
                    </TableRow>
                </TableBody>
            </Table>
        </div>
        <div v-else-if="submissions && submissions.length === 0" class="text-center text-gray-500">
            No submissions found for this assignment.
        </div>
        <div v-else-if="error" class="text-center text-red-500">
            Failed to load submissions. Please try again.
        </div>
    </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast';

definePageMeta({
    layout: 'admin',
})

const route = useRoute();
const router = useRouter();
const assignmentId = route.params.id;

const { data: submissions, status, error } = await useFetch(`/api/admin/assignments/${assignmentId}/submissions`);

const { toast } = useToast()

if (error.value) {
    toast({ title: 'Failed to fetch submissions', variant: 'destructive' });
}

const evaluateSubmission = (submissionId) => {
    router.push(`/admin/assignments/${assignmentId}/submissions/${submissionId}/evaluate`);
};

const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
};
</script>

<style lang="scss" scoped></style>