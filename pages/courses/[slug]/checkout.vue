<template>
    <div class="flex flex-col gap-4 pt-14">

        <button @click="pay('bKash')">
            Pay with bKash
        </button>
        <button @click="pay('Nagad')">
            Pay with Nagad
        </button>
        <button @click="pay(null)">
            Pay with SSLCommerz
        </button>

    </div>
</template>

<script setup>

const route = useRoute();

const { data } = useFetch(`/api/payment/${route.params.slug}`);

const pay = async (provider) => {
    try {
        const response = await $fetch(`/api/payment`, {
            method: 'POST',
            body: {
                provider,
                slug: route.params.slug
            }
        });

        window.location.href = response;
    } catch (error) {
        console.log(error);
    }
}


</script>

<style lang="scss" scoped></style>