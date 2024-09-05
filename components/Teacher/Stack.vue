<template>

    <div class="flex items-center -space-x-2">
        <Avatar v-for="a in authors" :key="a.id" class="border-2 border-rose-500">
            <AvatarImage :src="a.image" :alt="a.name" class="object-top" />
            <AvatarFallback>JP</AvatarFallback>
        </Avatar>

    </div>
</template>

<script setup>

const { authors } = defineProps({
    authors: {
        type: Array,
        required: true
    }
})



</script>

<style lang="scss" scoped></style>