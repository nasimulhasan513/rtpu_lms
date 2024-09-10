<template>
    <AppModal :isOpen="isOpen" title="Welcome back!" description="Our new website will launch soon..."
        @onClose="onClose" v-if="isOpen">



    </AppModal>
</template>

<script setup>

const { isOpen, onClose } = useLogin()


</script>
