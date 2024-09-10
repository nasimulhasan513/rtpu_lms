<template>
    <AppModal :isOpen="isOpen" title="Course's teacher" description="Teacher's Information" @onClose="onClose"
        v-if="isOpen">
        <AppLoader v-if="isLoading" />

        <div class="space-y-6">

           


            <form @submit="onSubmit">
                <div class="space-y-6">
                    <div @click="browse"
                        class="relative flex flex-col items-center justify-center gap-4 p-20 transition border-2 cursor-pointer hover:opacity-70 border-nuetral-300 text-nuetral-600">
                        <input type="file" class="hidden" accept="image/*" capture="user" ref="uploadInput"
                            @change="selectFile" />
                        <Icon v-if="!form.values.image" name="lucide:image-plus" size="50" />
                        <div v-if="!form.values.image" class="text-lg font-semibold">Click to upload</div>
                        <div v-else class="absolute inset-0 w-full h-full">
                            <NuxtImg :src="form.values.image" class="object-cover w-full h-full" alt="teacher" />
                        </div>
                    </div>
                    <FormField v-slot="{ componentField }" name="name">
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Teacher's Name" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>


                    <FormField v-slot="{ componentField }" name="designation">
                        <FormItem>
                            <FormLabel>Teacher's Designation</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Teacher's Designation" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="short_designation">
                        <FormItem>
                            <FormLabel>Teacher's Short Designation</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Teacher's Designation" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="biography">
                        <FormItem>
                            <FormLabel>Teacher's Biography</FormLabel>
                            <FormControl>
                                <Textarea type="text" placeholder="Teacher's Biography" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>




                </div>
                <div class="flex flex-col gap-2 py-6">
                    <div class="flex flex-row items-center w-full gap-4">
                        <Button type="submit" class="w-full">
                            {{ initialValues.id ? 'Update' : 'Create' }} an teacher
                        </Button>
                    </div>


                </div>
            </form>
        </div>
        <AppModal :isOpen="isPicOpen" title="Upload image" description="Crop and resize the image"
            @onClose="isPicOpen = false">

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
            <div class="flex justify-end gap-3 mt-4">
                <Button variant="destructive" @click="isPicOpen = false">
                    Cancel
                </Button>
                <Button @click="getResult">
                    <Icon name="lucide:upload" class="mr-2" />
                    {{ uploading ? 'Uploading...' : 'Save' }}
                </Button>
            </div>
        </AppModal>
    </AppModal>
</template>

<script setup>
import VuePictureCropper, { cropper } from 'vue-picture-cropper'

import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { teacherSchema } from '~/schema/teacher.schema';

const { isOpen, onClose, onOpen, initialValues } = useTeachermodal()

const formSchema = toTypedSchema(teacherSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        image: '',
        short_designation: '',
        biography: '',
        designation: ''
    }
})

const isLoading = ref(false)
const { toast } = useToast()



const onSubmit = form.handleSubmit(async () => {

    try {
        isLoading.value = true


        if (initialValues.value.id) {
            await $fetch(`/api/admin/teachers/${initialValues.value.id}`, {
                method: 'put',
                body: form.values
            })
        } else {
            await $fetch('/api/admin/teachers', {
                method: 'post',
                body: form.values
            })
        }

        refreshNuxtData('teachers')
        return onClose()
    } catch (error) {
        return toast({
            title: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})


watch(() => initialValues.value, (value) => {
    form.setValues({
        name: value.name,
        biography: value.biography,
        shortDesignation: value.shortDesignation,
        designation: value.designation,
        image: value.image
    })
}, {
    immediate: true
})


const isPicOpen = ref(false)
const pic = ref(null)
const uploadInput = ref(null)
const browse = () => {
    uploadInput.value.click()
}

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
        isPicOpen.value = true

        // Clear selected files of input element
        if (!uploadInput.value) return
        uploadInput.value.value = ''
    }
}

const uploading = ref(false)
async function getResult() {
    if (!cropper) return
    uploading.value = true
    const blob = await cropper.getBlob()
    if (!blob) return
    const fileName = `${new Date().toISOString()}_${Math.random()}`

    const file = await cropper.getFile({
        fileName
    })
    const { uploadUrl, imageUrl } = await getUploadUrl(fileName, file.type, file.size)

    try {
        await fetch(uploadUrl, {
            method: 'PUT',
            body: file,
        })

        isPicOpen.value = false
        uploading.value = false

        form.setFieldValue('image', imageUrl)

    } catch (error) {
        console.error(error)
    }
}

const getUploadUrl = async (fileName, fileType, fileSize) => {
    const response = await $fetch('/api/shared/signed', {
        method: 'POST',
        body: { fileName, fileType, fileSize },
    })
    return response
}



</script>
<style lang="scss" scoped></style>