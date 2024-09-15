<template>
    <div @click="navigateTo('/')" class="flex items-center gap-2 cursor-pointer">
        <img :src="route.params.shop ? shop?.logo : defaultLogo" :alt="shop?.name" class="h-10" />

        <span v-if="!route.params.shop" class="hidden text-xl font-bold md:block text-primary ">কোর্স</span>
    </div>

</template>

<script setup>
import defaultLogo from '~/assets/logo.png'
const { shop } = useShop()


const route = useRoute()


</script>

<style lang="scss" scoped></style>