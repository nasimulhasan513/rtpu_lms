<template>
    <div @click="chooseImage"
        class="relative flex flex-col items-center justify-center gap-4 transition border-2 cursor-pointer hover:opacity-70 border-nuetral-300 text-nuetral-600"
        :class="{
            'border-dashed': !coverImage,
            'border-solid': coverImage,
            'border-primary-500': coverImage,
            'max-w-[200px] max-h-[200px] p-5': size === 'sm',
            'max-w-[300px] max-h-[300px] p-10': size === 'md',
            'max-w-[400px] max-h-[400px] p-20': size === 'lg',
        }">
        <input type="file" class="hidden" accept="image/*" capture="user" ref="uploadInput"
            @change="uploadImageToServer" />
        <Icon v-if="!coverImage" name="lucide:image-plus" size="30" />
        <div v-if="!coverImage" class="text-lg font-semibold" :class="{
            'text-nuetral-600': !coverImage,
            'text-primary-500': coverImage,
            'text-base': size === 'sm',

        }">Upload {{ label }}</div>
        <div v-else class="absolute inset-0 w-full h-full">
            <NuxtImg :src="coverImage" class="object-cover w-full h-full" alt="teacher" />
        </div>
    </div>

</template>

<script setup>



const { prefix, image } = defineProps({
    prefix: {
        type: String,
        default: ''
    },
    image: {
        type: String,
        default: ''
    },
    label: {
        type: String,
        default: 'Image'
    },
    size: {
        type: String,
        default: 'sm'
    }
})

const emits = defineEmits(['uploaded'])

const { progress, uploadImage, deleteImage, } = useCloudflareImage()
const coverImage = ref(image)
const coverUploader = ref(null)
const chooseImage = () => {
    coverUploader.value.click()
}
const uploadImageToServer = async (e) => {
    const file = e.target.files[0]

    if (coverImage.value) {
        await deleteImage(coverImage.value)
    }

    const imageUrl = await uploadImage(file)
    coverImage.value = imageUrl
    emits('uploaded', imageUrl)
}

</script>

<style lang="scss" scoped></style>