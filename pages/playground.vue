<template>
    <div class="min-h-[76vh] flex items-center justify-center">
        <pre>
            {{ formattedDate }}
        </pre>
    </div>
</template>

<script setup>

import { toZonedTime, formatInTimeZone } from "date-fns-tz";


const date = new Date('2024-09-20T01:30:00.000Z');

const formattedDate = inputFormat(date);



</script>

<style lang="scss" scoped></style>