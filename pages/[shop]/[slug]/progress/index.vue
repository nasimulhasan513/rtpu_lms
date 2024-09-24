<template>
    <AppContainer>
        <div class="progress-page">
            <div class="header">
                <h1>Progress Report</h1>
            </div>

            <div v-if="data && data.submissions" class="progress-list">
                <div v-for="submission in data.submissions" :key="submission.id" class="progress-item">
                    <div class="exam-title">{{ submission.exam.title }}</div>
                    <div class="marks">Marks: {{ submission.marks }}</div>
                    <div v-if="submission.correct !== null" class="correct">Correct: {{ submission.correct }}</div>
                    <div v-if="submission.wrong !== null" class="wrong">Wrong: {{ submission.wrong }}</div>
                </div>
            </div>
            <div v-else>
                <p>No progress data available.</p>
            </div>
        </div>
    </AppContainer>
</template>

<script setup>
definePageMeta({
    layout: "course"
})

const { data } = useFetch("/api/question/progress")
</script>

<style lang="css" scoped>
.progress-page {
    padding: 1rem;
}

.header {
    margin-bottom: 1rem;
}

.progress-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.progress-item {
    border: 1px solid #ccc;
    padding: 1rem;
    border-radius: 0.5rem;
    background-color: #f9f9f9;
}

.exam-title {
    font-size: 1.25rem;
    font-weight: bold;
    margin-bottom: 0.5rem;
}

.marks, .correct, .wrong {
    font-size: 1rem;
    margin-bottom: 0.25rem;
}
</style>