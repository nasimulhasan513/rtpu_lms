<template>
    <Card class="flex flex-col h-full">

        <CardHeader>
            <div class="flex items-center justify-between">
                <CardTitle class="text-xl font-bold">{{ exam.title }}</CardTitle>
                <Badge
                    :variant="exam.status === 'ongoing' ? 'destructive' : exam.status === 'upcoming' ? 'secondary' : 'outline'"
                    class="text-xs font-semibold">
                    {{ exam.status.charAt(0).toUpperCase() + exam.status.slice(1) }}
                </Badge>
            </div>
            <p class="mt-1 text-sm text-muted-foreground" v-if="exam.subject.name!=='Others'" >{{ exam.subject.name }}</p>
            <p class="mt-1 text-sm text-muted-foreground">{{ exam.description }}</p>
        </CardHeader>
        <CardContent class="flex-grow">
            <div class="grid grid-cols-2 gap-4 mb-6">
                <ExamInfoBox icon="lucide:calendar" label="Start" :value="formatDate(exam.startTime)"
                    color="text-blue-500" />
                <ExamInfoBox icon="lucide:calendar" label="End" :value="formatDate(exam.endTime)"
                    color="text-red-500" />
                <ExamInfoBox icon="lucide:clock" label="Duration" :value="`${exam.duration} minutes`"
                    color="text-green-500" />
                <ExamInfoBox icon="lucide:award" label="Total Marks"
                    :value="`${exam.totalMarks} x 1 = ${exam.totalMarks}`" color="text-yellow-500" />
            </div>

            <div v-if="exam.status !== 'past'" class="p-4 rounded-lg bg-primary/5">
                <div class="flex items-center justify-center mb-3 text-sm font-medium">
                    <Icon name="lucide:timer" class="w-5 h-5 mr-2 text-primary" />
                    <p class="font-semibold text-center">
                        পরীক্ষা {{ exam.status === 'ongoing' ? 'শেষ' : 'শুরু' }} হতে সময় বাকি
                    </p>
                </div>
                <div class="flex justify-center">
                    <AppTimer v-if="exam.status === 'ongoing'" :end="exam.endTime" />
                    <AppTimer v-else-if="exam.status === 'upcoming'" :end="exam.startTime" />
                </div>
            </div>
        </CardContent>
        <CardFooter class="flex justify-center space-x-3">

            <Button v-if="exam.status === 'ongoing' && (!exam.submission || exam.submission.status === 'pending')"
                @click="navigateTo(`exams/${exam.id}/onboard`)" class="w-full">
                Start Exam
            </Button>
            <p v-else-if="exam.status === 'ongoing'" class="font-semibold text-green-500">
                Thanks for participation.
            </p>
            <template v-if="exam.status === 'past'">
                <Button @click="navigateTo(`exams/${exam.id}/practice`)" variant="outline" class="flex-1">
                    <Icon name="lucide:book-open" class="w-4 h-4 mr-2" />
                    Practice Exam
                </Button>
                <Button @click="navigateTo(`exams/${exam.id}/solution`)" variant="outline" class="flex-1">
                    <Icon name="lucide:check-circle" class="w-4 h-4 mr-2" />
                    Solution
                </Button>
                <Button @click="navigateTo(`exams/${exam.id}/leaderboard`)" variant="outline" class="flex-1">
                    <Icon name="lucide:trophy" class="w-4 h-4 mr-2" />
                    Leaderboard
                </Button>
            </template>
        </CardFooter>
    </Card>
</template>

<script setup lang="ts">

const { exam } = defineProps({
    exam: {
        type: Object,
        required: true,
    },
})
</script>

<style lang="scss" scoped></style>