<template>
    <div class="h-[68vh] flex flex-col gap-2 justify-center items-center">
        <AppHeading center :title="title ? title : 'কোন পরীক্ষা নির্ধারিত নেই'"
            :subtitle="subtitle ? subtitle : 'আসন্ন পরীক্ষাসমূহ'" />
        <div class="w-48 mt-4">
            <Button outline @click="navigateTo('/')" v-if="showReset"> Back to home

            </Button>
        </div>
    </div>
</template>
<script setup lang="ts">
interface EmptyStateProps {
    title?: string;
    subtitle?: string;
    showReset?: boolean;
}
defineProps<EmptyStateProps>();
</script>
