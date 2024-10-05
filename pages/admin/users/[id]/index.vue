<template>
    <div>
        <pre>
    {{ data }}
</pre>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'admin'
})
const route = useRoute()
const { data, status } = useFetch('/api/auth/' + route.params.id)

</script>

<style lang="scss" scoped></style>