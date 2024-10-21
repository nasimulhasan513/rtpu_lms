<template>
    <div @click="navigateTo('/')" class="flex items-center gap-2 cursor-pointer">
        <img :src="isHomePage ? darkLogo : whiteLogo" alt="RTPU" class="h-10" />
    </div>

</template>

<script setup>
import whiteLogo from '~/assets/image/white_logo.png'
import darkLogo from '~/assets/image/dark_logo.png'


const route = useRoute()

const isHomePage = computed(() => route.path === '/')


</script>

<style lang="scss" scoped></style>