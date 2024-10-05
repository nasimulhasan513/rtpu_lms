<script setup lang="ts">
import { computed } from 'vue'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Bar } from 'vue-chartjs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

interface ExamSubmission {
    title: string
    totalMarks: number
    duration: number
    totalDuration: number
    marks: number
    correct: number
    wrong: number
    percentage: number
    accuracy: number // New property
}

interface ExamProgress {
    total: number
    completed: number
    percentage: number
    submissions: ExamSubmission[]
}

const props = defineProps<{
    examProgress: ExamProgress
}>()

const chartData = computed(() => {
    return {
        labels: props.examProgress.submissions.map(s => s.title),
        datasets: [
            {
                label: 'Exam Score (%)',
                data: props.examProgress.submissions.map(s => s.percentage),
                backgroundColor: '#0ea5e9',
                borderColor: '#0ea5e9',
                borderWidth: 1
            },
            {
                label: 'Accuracy (%)',
                data: props.examProgress.submissions.map(s => s.accuracy),
                backgroundColor: '#10b981',
                borderColor: '#10b981',
                borderWidth: 1
            },
            {
                label: 'Time Efficiency (%)',
                data: props.examProgress.submissions.map(s => s.durationEfficiency),
                backgroundColor: '#f59e0b',
                borderColor: '#f59e0b',
                borderWidth: 1
            }
        ]
    }
})

const chartOptions = {
    responsive: true,
    scales: {
        y: {
            beginAtZero: true,
            max: 100
        }
    }
}
</script>

<template>
    <Card class="w-full">
        <CardHeader>
            <CardTitle>
                <h3 class="text-lg font-semibold">Exam Scores and Accuracy</h3>
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div class="space-y-4">
                <div>
                    <Bar :data="chartData" :options="chartOptions" class="mt-4" />
                </div>

                <div>
                    <h3 class="mb-2 text-lg font-semibold text-center">Detailed Exam Results</h3>
                    <div class="p-3 border rounded-md">
                        <Table>
                            <TableHeader class="bg-background">
                                <TableRow>
                                    <TableHead>Exam Title</TableHead>
                                    <TableHead class="text-center">Score</TableHead>
                                    <TableHead class="text-center">Accuracy</TableHead>
                                    <TableHead class="text-center">Time Efficiency</TableHead>
                                    <TableHead class="text-center">Status</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="submission in examProgress.submissions" :key="submission.title">
                                    <TableCell>{{ submission.title }}</TableCell>
                                    <TableCell>

                                        <div class="flex flex-col items-center justify-center">
                                            <div class="text-sm">
                                                {{ submission.marks }} / {{ submission.totalMarks }}
                                            </div>
                                            <div class="mt-1">
                                                <Badge
                                                    :variant="submission.percentage > 33 ? 'success' : 'destructive'">
                                                    {{ submission.percentage > 33 ? '+' : '' }}{{ submission.percentage
                                                    }}%
                                                </Badge>
                                            </div>
                                        </div>




                                    </TableCell>

                                    <TableCell>

                                        <div class="flex flex-col items-center justify-center">


                                            <div class="flex items-center justify-center gap-2">
                                                <span class="w-2 h-2 bg-green-500 rounded-full"></span>
                                                <span>{{ submission.correct }}</span>
                                                <span class="w-2 h-2 bg-red-500 rounded-full"></span>
                                                <span>{{ submission.wrong }}</span>
                                            </div>

                                            <Badge :variant="submission.accuracy > 0 ? 'success' : 'destructive'">
                                                {{ submission.accuracy > 0 ? '+' : '' }}{{ submission.accuracy }}%
                                            </Badge>
                                        </div>

                                    </TableCell>
                                    <TableCell class="text-center">
                                        <div class="flex flex-col items-center justify-center">






                                            <div class="text-sm">
                                                {{ millisecToTime(submission.duration) }} / {{
                        millisecToTime(submission.totalDuration) }}
                                            </div>
                                            <div class="mt-1">
                                                <Badge
                                                    :variant="submission.durationEfficiency > 0 ? 'success' : 'destructive'">
                                                    {{ submission.durationEfficiency > 0 ? '+' : '' }}{{
                        submission.durationEfficiency }}%
                                                </Badge>
                                            </div>
                                        </div>

                                    </TableCell>
                                    <TableCell class="flex justify-center">
                                        <ProgressDetails :subjectBreakDown="submission.subjectBreakDown"
                                            :passMark="submission.passMarks" :isPassed="submission.passed" />
                                    </TableCell>
                                </TableRow>
                                <TableRow class="font-bold">
                                    <TableCell>Overall Progress</TableCell>

                                    <TableCell class="text-center">{{ (examProgress.submissions.reduce((acc, curr) =>
                        acc
                        + curr.percentage,
                        0) / examProgress.submissions.length).toFixed(2) }}%</TableCell>
                                    <TableCell class="text-center">{{ (examProgress.submissions.reduce((acc, curr) =>
                        acc
                        + curr.accuracy, 0)
                        / examProgress.submissions.length).toFixed(2) }}%</TableCell>

                                    <TableCell class="text-center">{{ (examProgress.submissions.reduce((acc, curr) =>
                                        acc
                                        + curr.durationEfficiency, 0)
                                        / examProgress.submissions.length).toFixed(2) }}%</TableCell>


                                </TableRow>
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </CardContent>
    </Card>
</template>