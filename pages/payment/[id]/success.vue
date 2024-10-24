<template>
    <div>
    <h1>Payment Success</h1>
    <pre>{{ paymentData }}</pre>
  </div>
</template>

<script setup>
const route = useRoute();

const { data: paymentData } = useFetch(`/api/payment/${route.params.id}`);
</script>

<style lang="scss" scoped></style>