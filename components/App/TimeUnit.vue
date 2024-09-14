<script setup lang="ts">
import { defineProps } from 'vue'

interface TimeUnitProps {
    value: number
    label: string
    color: string
}

const props = defineProps<TimeUnitProps>()

const formatNumber = (n: number) => Intl.NumberFormat('bn-BD').format(n)
</script>

<template>
    <div
        :class="`flex flex-col items-center justify-center w-10 h-10 sm:w-16 sm:h-16 rounded-lg bg-gray-50 dark:bg-gray-800 ring-1 ring-${props.color}-400`">
        <span class="text-lg font-semibold text-gray-800 dark:text-gray-200">
            {{ formatNumber(props.value) }}
        </span>
        <span class="text-xs text-gray-600 dark:text-gray-400">{{ props.label }}</span>
    </div>
</template>