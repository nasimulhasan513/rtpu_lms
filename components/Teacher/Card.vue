<template>
    <Card class="flex items-center flex-1 h-full gap-4 p-4 rounded-md">
        <Avatar>
            <AvatarImage :src="image" class="object-cover object-top" />
            <AvatarFallback></AvatarFallback>
        </Avatar>
        <div>
            <p class="text-sm font-medium leading-none">
                {{ name }}
            </p>
            <p class="text-sm text-muted-foreground">
                {{ biography }}
            </p>
        </div>

    </Card>
</template>

<script setup lang="ts">

interface AuthorProps {
    name: string;
    image: string;
    biography: string;
}


const props = defineProps<AuthorProps>()


</script>

<style lang="scss" scoped></style>