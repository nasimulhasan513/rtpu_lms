<template>
    <div>
        <p>
            mycourses
        </p>
        <pre>

            {{ data }}
        </pre>
    </div>
</template>

<script setup>

const { data } = await useFetch("/api/courses/mycourses");

</script>

<style lang="scss" scoped></style>