<template>
    <div>
        <div>
            <h1>Progress</h1>
        </div>

        <pre>{{ data }}</pre>
    </div>
</template>

<script setup>

definePageMeta({
    layout: "course"
})


const { data } = useFetch("/api/question/progress")


</script>

<style lang="scss" scoped></style>