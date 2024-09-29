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
            <p class="mt-1 text-sm text-muted-foreground" v-if="exam.subject.name !== 'Others'">{{ exam.subject.name }}
            </p>
            <p class="mt-1 text-sm text-muted-foreground" v-if="exam.description">{{ exam.description }}</p>
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
                    :value="`${exam.totalMarks} x 1 = ${exam.totalMarks} ${exam.negativeMarking ? '(-0.25/wrong answer)' : ''}`"
                    color="text-yellow-500" />
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
            <div>
                <div v-if="(exam.submission && exam.submission.status === 'submitted') && (exam.status === 'past' || exam.instantResult)"
                    class="p-4 mt-4 space-y-2 text-center bg-green-100 rounded-lg">
                    <p class="text-lg font-semibold text-green-700">Your Score</p>
                    <p class="text-3xl font-bold text-green-800">
                        {{ exam.submission.marks }} <span class="text-xl text-green-600">/ {{ exam.totalMarks }}</span>
                    </p>
                    <p class="text-sm text-green-600">
                        Average Score: {{ exam.avgMarks.toFixed(2) }}
                    </p>
                </div>
                <div v-else-if="exam.status === 'past' && (!exam.submission || exam.submission.status === 'pending')">
                    <div class="p-4 mt-4 text-center bg-yellow-100 rounded-lg">
                        <Icon name="lucide:alert-circle" class="w-8 h-8 mx-auto mb-2 text-yellow-600" />
                        <p class="text-lg font-semibold text-yellow-700">Not Participated</p>
                        <p class="mt-2 text-sm text-yellow-600">
                            You didn't participate in this exam.
                        </p>
                    </div>
                </div>

            </div>
        </CardContent>
        <CardFooter class="flex justify-center space-x-3">

            <Button v-if="exam.status === 'ongoing' && (!exam.submission || exam.submission.status === 'pending')"
                @click="navigateTo(`mcq/${exam.id}/onboard`)" class="w-full">
                Start Exam
            </Button>
            <p v-else-if="exam.status === 'ongoing' && !exam.instantResult" class="font-semibold text-green-500">
                Thanks for participation.
            </p>

            <template
                v-else-if="exam.resultPublished || (exam.instantResult
                && (!exam.submission || exam.submission.status === 'submitted')) && exam.status !== 'upcoming'">

                <Button @click="navigateTo(`mcq/${exam.id}/practice`)" variant="outline" class="flex-1">
                    <Icon name="lucide:book-open" class="w-4 h-4 mr-2" />
                    Practice Exam
                </Button>
                <Button @click="navigateTo(`mcq/${exam.id}/solution`)" variant="outline" class="flex-1">
                    <Icon name="lucide:check-circle" class="w-4 h-4 mr-2" />
                    Solution
                </Button>
                <Button @click="navigateTo(`mcq/${exam.id}/leaderboard`)" variant="outline" class="flex-1">
                    <Icon name="lucide:trophy" class="w-4 h-4 mr-2" />
                    Leaderboard
                </Button>
            </template>

            <div v-else-if="exam.status === 'past' && !exam.resultPublished" class="text-center text-emerald-500">
                Result will be published at {{ formatDate(exam.resultPublishTime) }}
            </div>


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