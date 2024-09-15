<template>
    <div class="container px-4 py-8 mx-auto">
        <div class="flex items-center justify-between mb-8">
            <AppHeading title="Course Categories" subtitle="Create, Update or organize categories." />
            <Button @click="openModal" size="sm">
                <Icon name="lucide:plus" class="mr-2" />
                Add Category
            </Button>
        </div>

        <div v-if="status === 'success'" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            <Card v-for="category in data" :key="category.id" class="overflow-hidden transition-shadow hover:shadow-lg">
                <CardContent class="p-0">
                    <div class="relative h-48">
                        <NuxtImg :src="category.image" :alt="category.name" class="object-cover w-full h-full" />
                        <div class="absolute top-0 right-0 m-2">
                            <NuxtImg :src="category.logo" :alt="category.name"
                                class="w-12 h-12 p-1 bg-white rounded-full" />
                        </div>
                    </div>
                    <div class="p-4">
                        <h3 class="mb-2 text-xl font-semibold">{{ category.name }}</h3>
                        <p class="mb-2 text-sm text-gray-600">{{ category.platformName }}</p>
                        <p class="text-lg font-bold text-primary">{{ formatPrice(category.price) }}</p>
                        <div class="mt-2 space-x-2">
                            <Badge v-if="category.is_class" variant="secondary">Class</Badge>
                            <Badge v-if="category.is_mcq" variant="secondary">MCQ Exam</Badge>
                            <Badge v-if="category.is_cq" variant="secondary">CQ Exam</Badge>
                        </div>
                    </div>
                </CardContent>
                <CardFooter class="flex justify-end p-2 space-x-2 border-t bg-gray-50">
                    <Button @click="openModal(category)" variant="outline" size="sm">
                        <Icon name="lucide:pencil" size="16" />
                    </Button>
                    <Button @click="deleteCategory(category.id)" variant="destructive" size="sm">
                        <Icon name="lucide:trash" size="16" />
                    </Button>
                </CardFooter>
            </Card>
        </div>

        <AppModal :isOpen="isOpen" :title="editingCategory ? 'Update Category' : 'Create Category'"
            :description="editingCategory ? 'Update existing category' : 'Create a new category'" @onClose="closeModal"
            v-if="isOpen">
            <form @submit.prevent="onSubmit" class="space-y-6">
                <div class="grid grid-cols-2 gap-6">
                    <div class="col-span-2">
                        <ImageUpload :image="form.values.image" @upload="uploadCategoryCover" label="Category Cover"
                            class="h-64" />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <ImageUpload :image="form.values.logo" @upload="uploadCategoryLogo" label="Category Logo"
                            class="h-32" />
                    </div>
                    <div class="col-span-2 sm:col-span-1">
                        <FormField v-slot="{ componentField }" name="name">
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>
                    <FormField v-slot="{ componentField }" name="slug">
                        <FormItem>
                            <FormLabel>Shop Link</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="platformName">
                        <FormItem>
                            <FormLabel>Platform Name</FormLabel>
                            <FormControl>
                                <Input v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="price">
                        <FormItem>
                            <FormLabel>Price</FormLabel>
                            <FormControl>
                                <Input type="number" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                </div>
                <div class="grid grid-cols-3 gap-6">
                    <FormField v-slot="{ componentField }" name="is_class">
                        <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox :checked="form.values.is_class"
                                    @update:checked="form.setFieldValue('is_class', !form.values.is_class)" />
                            </FormControl>
                            <FormLabel class="font-normal">
                                Class
                            </FormLabel>
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="is_mcq">
                        <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox :checked="form.values.is_mcq"
                                    @update:checked="form.setFieldValue('is_mcq', !form.values.is_mcq)" />
                            </FormControl>
                            <FormLabel class="font-normal">
                                MCQ Exam
                            </FormLabel>
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="is_cq">
                        <FormItem class="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                                <Checkbox :checked="form.values.is_cq"
                                    @update:checked="form.setFieldValue('is_cq', !form.values.is_cq)" />
                            </FormControl>
                            <FormLabel class="font-normal">
                                CQ Exam
                            </FormLabel>
                        </FormItem>
                    </FormField>
                </div>
                <AppButton type="submit" class="w-full" :loading="isLoading"
                    :label="editingCategory ? 'Update Category' : 'Create Category'"
                    :loadingLabel="editingCategory ? 'Updating...' : 'Creating...'" />
            </form>
        </AppModal>
    </div>
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
const editingCategory = ref(null)

const closeModal = () => {
    isOpen.value = false
    editingCategory.value = null
    form.resetForm()
}

const openModal = (category = null) => {
    editingCategory.value = category
    if (category) {
        form.setValues({
            name: category.name,
            slug: category.slug,
            image: category.image,
            logo: category.logo,
            platformName: category.platformName,
            price: category.price,
            is_class: category.is_class,
            is_mcq: category.is_mcq,
            is_cq: category.is_cq,
        })
    }
    isOpen.value = true
}

const formSchema = toTypedSchema(CategorySchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        name: '',
        image: '',
        slug: '',
        logo: '',
        platformName: '',
        price: 0,
        is_class: false,
        is_mcq: false,
        is_cq: false,
    }
})

const isLoading = ref(false)
const { toast } = useToast()

const onSubmit = form.handleSubmit(async (values) => {
    try {
        isLoading.value = true

        if (editingCategory.value) {
            await $fetch(`/api/admin/courses/categories/${editingCategory.value.id}`, {
                method: 'PUT',
                body: values
            })
            toast({
                title: 'Category updated successfully',
                variant: 'success'
            })
        } else {
            await $fetch('/api/admin/courses/categories', {
                method: 'POST',
                body: values
            })
            toast({
                title: 'Category created successfully',
                variant: 'success'
            })
        }

        refresh()
        closeModal()
    } catch (error) {
        toast({
            title: 'Error',
            description: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})

const { uploadImage, deleteImage } = useCloudflareImage()

const coverUploader = ref(null)
const chooseCover = () => {
    coverUploader.value.click()
}

const uploadCategoryCover = async (e) => {
    const file = e.target.files[0]

    if (form.values.image) {
        await deleteImage(form.values.image)
    }

    const imageUrl = await uploadImage(file, 'categories/')
    form.setFieldValue('image', imageUrl)
}

const logoUploader = ref(null)
const chooseLogo = () => {
    logoUploader.value.click()
}

const uploadCategoryLogo = async (e) => {
    const file = e.target.files[0]

    if (form.values.logo) {
        await deleteImage(form.values.logo)
    }

    const logoUrl = await uploadImage(file, 'categories/logos/')
    form.setFieldValue('logo', logoUrl)
}

const deleteCategory = async (categoryId) => {
    if (confirm('Are you sure you want to delete this category?')) {
        try {
            await $fetch(`/api/admin/courses/categories/${categoryId}`, {
                method: 'DELETE'
            })
            toast({
                title: 'Category deleted successfully',
                variant: 'success'
            })
            refresh()
        } catch (error) {
            toast({
                title: 'Error deleting category',
                description: error.toString(),
                variant: 'destructive'
            })
        }
    }
}

const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'BDT' }).format(price)
}
</script>

<style lang="scss" scoped></style>