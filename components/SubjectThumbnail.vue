<template>


    <div @click="$emit('click')" class="p-4 transition-shadow rounded-lg shadow-md bg-background hover:shadow-lg">
        <h2 class="mb-2 text-lg font-semibold">{{ name }}</h2>
        <p class="text-gray-600">Total Lessons: {{ totalLessons }}</p>
    </div>

</template>

<script setup lang="ts">
interface Subject {
    id: string;
    name: string;
    totalLessons: number;
}

defineProps<Subject>();

defineEmits<{
    (e: 'click'): void;
}>();
</script>
