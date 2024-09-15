<template>
    <div @click="chooseFile"
        class="relative flex flex-col items-center justify-center gap-2 p-4 transition border-2 cursor-pointer hover:opacity-70 border-neutral-300 text-neutral-600"
        :class="{ 'h-full': true, [classs]: true }">
        <input type="file" class="hidden" accept="image/*" ref="fileInput" @change="handleUpload" />
        <Icon v-if="!image" name="lucide:image-plus" size="30" />
        <div v-if="!image" class="text-base font-semibold text-center">
            <p>Click to upload</p>
            <p class="text-sm font-thin text-secondary-foreground">{{ label }}</p>
        </div>
        <div v-else class="absolute inset-0 w-full h-full">
            <NuxtImg :src="image" class="object-cover w-full h-full" :alt="label" />
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    image: String,
    label: String,
    classs: String,
})

const emit = defineEmits(['upload'])

const fileInput = ref(null)

const chooseFile = () => {
    fileInput.value.click()
}

const handleUpload = (e) => {
    emit('upload', e)
}
</script>