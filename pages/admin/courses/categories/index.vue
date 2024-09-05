<template>
    <div class="flex justify-between">
        <AppHeading title="Course Categories" subtitle="Create, Update or organize categories." />

    </div>

    <div v-if="status === 'success'" class="grid gap-5 mt-5 md:grid-cols-6">
        <Card class="cursor-pointer" @click="onOpen">

            <CardContent class="flex flex-col items-center justify-center h-full">
                <div>
                    <div class="text-center">
                        <Icon name="lucide:plus" size="45" class="mx-auto" />
                    </div>
                    <p class="text-sm text-center">
                        Create a new category
                    </p>
                </div>
            </CardContent>


        </Card>
        <Card v-for="category in data" :key="category.id">
            <CardContent class="p-3 space-y-2">
                <div class="flex items-center justify-center">
                    <NuxtImg :src="category.image" :alt="category.name" class="rounded-sm" />


                </div>
                <h3 class="text-lg font-semibold text-center">{{ category.name }}</h3>

            </CardContent>
            <CardFooter class="flex items-center justify-center gap-2">

                <Button @click="onOpen" variant="outline" size="xs">
                    <Icon name="lucide:pencil" />
                </Button>
                <Button @click="onOpen" variant="destructive" size="xs">
                    <Icon name="lucide:trash" />

                </Button>


            </CardFooter>
        </Card>


    </div>


    <AppModal :isOpen="isOpen" title="Course Category" description="Create or Update Category" @onClose="onClose"
        v-if="isOpen">

        <form>
            <div class="space-y-6">
                <div @click="chooseCover"
                    class="relative flex flex-col items-center justify-center gap-4 p-20 transition border-2 cursor-pointer hover:opacity-70 border-nuetral-300 text-nuetral-600">
                    <input type="file" class="hidden" accept="image/*" capture="user" ref="coverUploader"
                        @change="uploadCategoryCover" />
                    <Icon v-if="!form.values.image" name="lucide:image-plus" size="50" />
                    <div v-if="!form.values.image" class="text-lg font-semibold">
                        <p>
                            Click to upload
                        </p>
                        <p class="text-sm font-thin text-secondary-foreground">
                            Category Logo/Cover
                        </p>
                    </div>
                    <div v-else class="absolute inset-0 w-full h-full">
                        <NuxtImg :src="form.values.image" class="object-cover w-full h-full" alt="teacher" />
                    </div>
                </div>

                <FormField v-slot="{ componentField }" name="name">
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Category Name" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <AppButton type="submit" class="w-full" :loading="isLoading" @click="onSubmit"
                    :label="initialValues.value ? 'Update' : 'Create'"
                    :loadingLabel="initialValues.value ? 'Updating...' : 'Creating...'">
                </AppButton>
            </div>

        </form>

    </AppModal>


</template>

<script setup>

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { CategorySchema } from '~/schema/category.schema'


const { data, status, refresh } = useFetch('/api/admin/courses/categories')



const isOpen = ref(false)
const onClose = () => {
    isOpen.value = false
}
const onOpen = () => {
    isOpen.value = true
}
const formSchema = toTypedSchema(CategorySchema)

const initialValues = ref({})

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        image: '',
    }
})

const isLoading = ref(false)
const { toast } = useToast()



const onSubmit = form.handleSubmit(async () => {

    try {
        isLoading.value = true


        if (initialValues.value.id) {
            await $fetch(`/api/admin/courses/categories/${initialValues.value.id}`, {
                method: 'put',
                body: form.values
            })
        } else {
            await $fetch('/api/admin/courses/categories', {
                method: 'post',
                body: form.values
            })
        }

        refresh()
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

const {
    uploadImage, deleteImage, } = useCloudflareImage()



const coverUploader = ref(null)
const chooseCover = () => {
    coverUploader.value.click()
}
const uploadCategoryCover = async (e) => {
    const file = e.target.files[0]

    if (form.values.image) {
        await deleteImage(form.values.image)
    }

    const imageUrl = await uploadImage(file, 'cover/')

    form.setFieldValue('image', imageUrl)

}



</script>

<style lang="scss" scoped></style>