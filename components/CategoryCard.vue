<template>
    <div class="overflow-hidden transition-shadow duration-300 rounded-lg shadow-md cursor-pointer bg-card hover:shadow-lg"
        @click="navigateTo(`/${category.slug}`)">
        <div class="h-48 overflow-hidden">
            <img :src="category.image" :alt="category.name"
                class="object-cover object-center w-full h-full transition-transform duration-300 hover:scale-105" />
        </div>

        <div class="p-4">
            <h3 class="mb-2 text-lg font-semibold line-clamp-1">{{ category.name }}</h3>
            <p class="flex items-center text-sm text-muted-foreground">
                <Icon name="lucide:book-open" class="w-4 h-4 mr-2" />
                {{ category.courseCount }} টি কোর্স
            </p>
        </div>
    </div>
</template>

<script setup>
defineProps({
    category: {
        type: Object,
        required: true
    }
})
</script>