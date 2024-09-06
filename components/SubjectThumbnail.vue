<template>
    <Card class="overflow-hidden transition-shadow cursor-pointer hover:shadow-md" @click="$emit('click')">
        <div class="relative flex items-center justify-center h-40 bg-gradient-to-br from-primary to-primary-dark">
            <CardTitle class="px-4 text-2xl font-bold text-center text-white">
                {{ subject.name }}
            </CardTitle>
        </div>
    </Card>
</template>

<script setup lang="ts">
interface Subject {
    id: string;
    title: string;
}

const props = defineProps<{
    subject: Subject;
}>();

defineEmits<{
    (e: 'click'): void;
}>();
</script>