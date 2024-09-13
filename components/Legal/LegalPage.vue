<template>
    <AppContainer class="py-10 min-h-[76vh]">
        <h1 class="mb-6 text-3xl font-bold">{{ title }}</h1>
        <div class="prose dark:prose-invert max-w-none ">
            <slot></slot>
        </div>
    </AppContainer>
</template>

<script setup lang="ts">
defineProps<{
    title: string;
}>();
</script>