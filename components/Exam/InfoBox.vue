<template>
    <div class="flex items-center p-2 rounded-lg bg-primary-foreground">
        <Icon :name="icon" class="w-5 h-5 mr-2" :class="color" />
        <div>
            <p class="text-xs text-muted-foreground">{{ label }}</p>
            <p class="text-xs ">{{ value }}</p>
        </div>
    </div>
</template>

<script setup lang="ts">
defineProps({
    icon: {
        type: String,
        required: true
    },
    label: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    color: {
        type: String,
        default: 'text-primary'
    }
})
</script>