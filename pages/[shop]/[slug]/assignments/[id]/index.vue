<template>
    <AppContainer>
        <div class="container flex flex-col min-h-screen p-4 mx-auto">
            <h1 class="mb-4 text-2xl font-bold">{{ assignment.title }}</h1>
            <p class="mb-4">{{ assignment.description }}</p>

            <Alert class="mb-4">
                <AlertTitle>Instructions</AlertTitle>
                <AlertDescription>
                    <ul class="list-disc list-inside">
                        <li>Select images for your completed assignment.</li>
                        <li>You can drag and drop images or use the upload button.</li>
                        <li>Reorder images by dragging them into the desired position.</li>
                        <li>Review your images before submitting.</li>
                        <li>Images will be uploaded when you submit the assignment.</li>
                    </ul>
                </AlertDescription>
            </Alert>

            <div class="mb-4">
                <DropZone @files-dropped="handleFilesDropped" class="p-8 border-2 border-dashed rounded-lg">
                    <div class="text-center">
                        <Icon name="uil:upload" class="w-12 h-12 mx-auto mb-2" />
                        <p>Drag and drop images here or click to upload</p>
                    </div>
                    <input type="file" ref="fileInput" @change="handleImageUpload" accept="image/*" multiple
                        class="hidden" />
                </DropZone>
            </div>

            <VueDraggable v-model="images" item-key="id"
                class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-2 md:grid-cols-3">
                <template #item="{ element }">
                    <div class="p-2 border rounded-lg">
                        <img :src="element.url" :alt="`Assignment Image`" class="w-full h-auto rounded" />
                        <div class="flex items-center justify-between mt-2">
                            <span class="text-sm text-gray-500">Drag to reorder</span>
                            <Button variant="destructive" size="sm" @click="removeImage(element.id)">
                                <Icon name="uil:trash-alt" class="w-4 h-4 mr-1" />
                                Remove
                            </Button>
                        </div>
                    </div>
                </template>
            </VueDraggable>

            <div class="mt-auto">
                <Button @click="submitAssignment" :disabled="images.length === 0" class="w-full">
                    Submit Assignment
                </Button>
            </div>
        </div>
    </AppContainer>
</template>

<script setup>
import VueDraggable from 'vuedraggable'
import { useToast } from '@/components/ui/toast'

definePageMeta({
    layout: 'default'
})

const { id, shop, slug } = useRoute().params

const { data: assignment } = await useFetch(`/api/courses/${slug}/assignments/${id}`)

const { uploadImage } = useCloudflareImage()
const { toast } = useToast()

const images = ref([])
const fileInput = ref(null)

const handleFilesDropped = async (files) => {
    for (const file of files) {
        addImage(file)
    }
}

const handleImageUpload = async (event) => {
    const files = event.target.files
    for (const file of files) {
        addImage(file)
    }
}

const addImage = (file) => {
    const id = Date.now().toString()
    const url = URL.createObjectURL(file)
    images.value.push({ id, url, file })
}

const removeImage = (id) => {
    const image = images.value.find(img => img.id === id)
    if (image && image.url.startsWith('blob:')) {
        URL.revokeObjectURL(image.url)
    }
    images.value = images.value.filter(img => img.id !== id)
}

const submitAssignment = async () => {
    try {
        const uploadedImages = []
        for (const image of images.value) {
            if (image.file) {
                const result = await uploadImage(image.file)
                uploadedImages.push(result)
            }
        }

        const response = await $fetch(`/api/courses/${slug}/assignments/${id}/submit`, {
            method: 'POST',
            body: {
                images: uploadedImages,
            },
        })

        if (response.success) {
            toast({
                title: 'Success',
                description: 'Assignment submitted successfully',
                variant: 'success',
            })
            // Revoke object URLs
            images.value.forEach(img => {
                if (img.url.startsWith('blob:')) {
                    URL.revokeObjectURL(img.url)
                }
            })
            // Redirect to assignments list
            navigateTo(`/${shop}/${slug}/assignments`)
        }
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to submit assignment',
            variant: 'destructive',
        })
    }
}

// Clean up object URLs when component is unmounted
onUnmounted(() => {
    images.value.forEach(img => {
        if (img.url.startsWith('blob:')) {
            URL.revokeObjectURL(img.url)
        }
    })
})
</script>

<style lang="scss" scoped></style>