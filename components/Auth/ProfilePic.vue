<template>
    <div class="relative group">
        <div class="w-24 h-24 overflow-hidden border-4 border-white rounded-full shadow-lg">
            <NuxtImg v-if="user.image" :src="user.image" :alt="user.name"
                class="object-cover w-full h-full transition-transform duration-300 group-hover:scale-110" />
            <div v-else class="flex items-center justify-center w-full h-full bg-gray-200">
                <Icon name="lucide:user" size="48" class="text-gray-400" />
            </div>
        </div>
        <Button @click="browse" size="icon" variant="outline"
            class="absolute bottom-0 right-0 transition-colors duration-300 rounded-full">
            <Icon name="lucide:camera" size="16" />
        </Button>
        <input type="file" class="hidden" accept="image/*" ref="uploadInput" @change="selectFile" />
    </div>

    <AppModal :isOpen="isOpen" title="Update profile picture" description="Crop and resize your profile picture"
        @onClose="isOpen = false">

        <div>
            <VuePictureCropper :boxStyle="{
                width: '100%',
                height: '100%',
                backgroundColor: '#f8f8f8',
                margin: 'auto',
            }" :img="pic" :options="{
                viewMode: 1,
                dragMode: 'crop',
                aspectRatio: 10 / 10,
            }" :presetMode="{
                mode: 'round',
                width: 300,
                height: 300,
            }" />
        </div>
        <div class="flex justify-end gap-3 mt-4">
            <Button variant="destructive" @click="isOpen = false">
                Cancel
            </Button>
            <Button @click="getResult">
                <Icon name="lucide:upload" class="mr-2" />
                {{ uploading ? 'Uploading...' : 'Save' }}
            </Button>




        </div>
    </AppModal>


</template>

<script setup>
import VuePictureCropper, { cropper } from 'vue-picture-cropper'


const uploadStatus = ref(null)

const isOpen = ref(false)
const user = useUser()
const uploadInput = ref(null)
const fileUploaded = ref(false)
const browse = () => {
    uploadInput.value.click()
}


const pic = ref(null)

const selectFile = (e) => {
    pic.value = ''

    // Get selected files
    const { files } = e.target
    if (!files || !files.length) return

    // Convert to dataURL and pass to the cropper component
    const file = files[0]
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => {
        // Update the picture source of the `img` prop
        pic.value = String(reader.result)

        // Show the modal
        isOpen.value = true

        // Clear selected files of input element
        if (!uploadInput.value) return
        uploadInput.value.value = ''
    }
}


const uploading = ref(false)
const assignUser = async () => {

    const data = await useRequestFetch()("/api/user");
    if (data) {
        user.value = data;
    }
}

const { deleteImage } = useCloudflareImage()

async function getResult() {
    if (!cropper) return
    uploading.value = true
    const blob = await cropper.getBlob()
    if (!blob) return
    const fileName = `${user.value.id}-${new Date().toISOString()}`

    const file = await cropper.getFile({
        fileName
    })
    const uploadUrl = await getUploadUrl(`/profile/${fileName}`, file.type, file.size)

    try {
        await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
        })


        if (user.value.image) {
            await deleteImage(user.value.image)
        }



        await assignUser()
        isOpen.value = false
        uploading.value = false


    } catch (error) {
        uploadStatus.value = 'Error uploading file.'
        console.error(error)
    }
}


const getUploadUrl = async (fileName, fileType, fileSize) => {
    const response = await $fetch('/api/auth/update_pic', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: { fileName, fileType, fileSize },
    })
    return response.uploadUrl
}



</script>