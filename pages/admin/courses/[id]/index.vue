<template>
    <div>

        <AppHeading :title="isEditing ? 'Edit course' : 'Create new course'"
            :subtitle="isEditing ? 'Update course details' : 'Fill up the form to create a new course'" />

        <div class="space-y-6">
          
            <form @submit="onSubmit">
                <div class="space-y-6">

                    <div class="grid grid-cols-5 gap-6">

                        <div class="col-span-3 space-y-6">
                            <FormField v-slot="{ componentField }" name="name">
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Course Name" v-bind="componentField" />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            </FormField>

                            <div class="grid grid-cols-2 gap-6">
                                <FormField v-slot="{ componentField }" name="categoryId">
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>

                                        <Select v-bind="componentField">
                                            <FormControl>
                                                <SelectTrigger class="bg-white">
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem v-for="c in categories" :key="c.id" :value="c.id">
                                                        {{ c.name }}
                                                    </SelectItem>
                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                                <FormField v-slot="{ componentField }" name="status">
                                    <FormItem>
                                        <FormLabel>Status</FormLabel>

                                        <Select v-bind="componentField">
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select status" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectGroup>
                                                    <SelectItem value="published">
                                                        Published
                                                    </SelectItem>
                                                    <SelectItem value="draft">
                                                        Draft
                                                    </SelectItem>
                                                    <SelectItem value="prebooking">
                                                        Prebooking
                                                    </SelectItem>
                                                    <SelectItem value="archieved">
                                                        Archieved
                                                    </SelectItem>

                                                </SelectGroup>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                </FormField>
                            </div>

                            <FormField v-slot="{ componentField }" name="slug">
                                <FormItem>
                                    <FormLabel>Course Link URL</FormLabel>
                                    <FormControl>
                                        <Input type="text" placeholder="Course Link URL" v-bind="componentField" />
                                    </FormControl>
                                    <FormMessage />
                                    <FormDescription>
                                        This will be used to generate the course link. It should be unique and contain
                                        only
                                        alphabets, numbers, and hyphens.
                                    </FormDescription>
                                </FormItem>
                            </FormField>
                        </div>

                        <div @click="chooseCover"
                            class="relative flex flex-col items-center justify-center col-span-2 gap-4 p-20 transition bg-white border-2 cursor-pointer dark:bg-muted/20 hover:opacity-70 border-nuetral-300 text-nuetral-600">
                            <input type="file" class="hidden" accept="image/*" ref="coverUploader"
                                @change="uploadBooksCover" />

                            <Icon v-if="!form.values.image" name="lucide:image-plus" size="50" />
                            <div v-if="!form.values.image" class="text-lg font-semibold">Upload cover image</div>
                            <div v-else class="absolute inset-0 w-full h-full">
                                <NuxtImg :src="form.values.image" class="object-cover w-full h-full" alt="Book Cover" />
                            </div>
                        </div>
                    </div>


                    <div v-if="status === 'success' && teachers.length > 0">
                        <h2 class="text-2xl font-semibold">
                            Select Teachers
                        </h2>
                        <div class="grid gap-3 mt-3 md:grid-cols-2">
                            <div v-for="a in teachers" @click="a.selected = !a.selected"
                                :class="{ 'border border-primary rounded-md': a.selected }">
                                <TeacherCard :name="a.name" :image="a.image" :biography="a.designation" />
                            </div>
                        </div>
                    </div>



                    <FormField v-slot="{ componentField }" name="short_description">
                        <FormItem>
                            <FormLabel>Short Description*</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Short Description" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                    <FormField v-slot="{ componentField }" name="description">
                        <FormItem>
                            <FormLabel>Description</FormLabel>
                            <FormControl>
                                <Textarea type="text" placeholder="Description" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>




                    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
                        <FormField v-slot="{ componentField }" name="duration">
                            <FormItem>
                                <FormLabel>Duration</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Duration (Month)" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>

                        </FormField>

                        <FormField v-slot="{ componentField }" name="enrolled">
                            <FormItem>
                                <FormLabel>Already Enrolled</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Already Entolled" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>


                    </div>


                    <div class="grid gap-6 md:grid-cols-2">
                        <FormField v-slot="{ componentField }" name="sale_price">
                            <FormItem>
                                <FormLabel>Sale Price</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Sale Price" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="regular_price">
                            <FormItem>
                                <FormLabel>Regular Price</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Regular Price" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                    </div>

                    <div class="grid gap-6 md:grid-cols-2">
                        <FormField v-slot="{ componentField }" name="fb_group">
                            <FormItem>
                                <FormLabel>Facebook Group</FormLabel>
                                <FormControl>
                                    <Input placeholder="Facebook Group Link (optional)" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="tg_group">
                            <FormItem>
                                <FormLabel>Telegram Group</FormLabel>
                                <FormControl>
                                    <Input placeholder="Telegram Group Link (optional)" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>

                    </div>
                    <div class="grid gap-6 md:grid-cols-2">
                        <FormField v-slot="{ componentField }" name="asg_shop_id">
                            <FormItem>
                                <FormLabel>Asg Shop</FormLabel>
                                <FormControl>
                                    <Input placeholder="Asg Shop ID (optional)" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="shop_charge">
                            <FormItem>
                                <FormLabel>Shop Charge</FormLabel>
                                <FormControl>
                                    <Input type="number" placeholder="Shop Charge" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>


                    </div>
                    <div class="grid grid-cols-2 gap-6">

                        <FormField v-slot="{ componentField }" name="sms_charge" class="col-span-3">
                            <FormItem>
                                <FormLabel>SMS Charge</FormLabel>
                                <FormControl>
                                    <Input type="number" step="0.01" placeholder="SMS Charge" v-bind="componentField" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        </FormField>


                        <div class="flex items-end gap-6 mb-3">
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
                    </div>
                    <FormField v-slot="{ value }" name="keywords">
                        <FormItem>
                            <FormLabel>Keywords</FormLabel>
                            <FormControl>
                                <TagsInput :model-value="value">
                                    <TagsInputItem v-for="item in value" :key="item" :value="item">
                                        <TagsInputItemText />
                                        <TagsInputItemDelete />
                                    </TagsInputItem>

                                    <TagsInputInput placeholder="Keywords..." />
                                </TagsInput>
                            </FormControl>
                            <FormDescription>
                                Set keywords for seo.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    </FormField>

                </div>
                <div class="py-6">
                    <Button type="submit">
                        Update Course
                    </Button>
                </div>
            </form>
        </div>

    </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { CourseSchema } from '~/schema/course.schema';

definePageMeta({
    layout: 'admin',
    middleware: 'admin',
})

const route = useRoute();
const isEditing = computed(() => route.params.id !== 'create');
const { data: existingCourse } = await useFetch(`/api/admin/courses/${route.params.id}`)
const { data: teachers, status } = await useAsyncData(async () => await $fetch('/api/admin/teachers'))
const { data: categories } = await useAsyncData(async () => await $fetch('/api/admin/courses/categories'))
const { updateCourse } = useCourse();

const formSchema = toTypedSchema(CourseSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: { ...existingCourse.value, teachers: existingCourse.value.teachers.map((a) => a.id) || [] }
})

const isLoading = ref(false)
const { toast } = useToast()

const onSubmit = form.handleSubmit(async (values) => {
    try {
        isLoading.value = true
        let result = await $fetch(`/api/admin/courses/${route.params.id}`, {
            method: 'PUT',
            body: values
        })

        if (result.error) {
            return toast({
                title: result.error.statusCode.toString(),
                description: result.error.statusMessage,
                variant: 'destructive'
            })
        }

        toast({
            title: isEditing.value ? 'Course updated successfully' : 'Course created successfully',
        })
        navigateTo('/admin/courses')
    } catch (error) {
        return toast({
            title: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})


watch(teachers.value, (newVal) => {
    let selected = newVal.filter(a => a.selected).map(a => a.id)
    form.setFieldValue('teachers', selected)

})
watch(existingCourse, (newVal) => {
    console.log(newVal);
    form.setValues({
        name: newVal.name,
        slug: newVal.slug,
        short_description: newVal.short_description,
        description: newVal.description,
        image: newVal.image,
        sale_price: newVal.sale_price,
        regular_price: newVal.regular_price,
        status: newVal.status,
        duration: newVal.duration,
        enrolled: newVal.enrolled,
        is_class: newVal.is_class,
        is_mcq: newVal.is_mcq,
        is_cq: newVal.is_cq,
        keywords: newVal.keywords,
        fb_group: newVal.fb_group,
        tg_group: newVal.tg_group,
        asg_shop_id: newVal.asg_shop_id,
        shop_charge: newVal.shop_charge,
        sms_charge: newVal.sms_charge,
        teachers: newVal.teachers,
        category: newVal.category,
        tags: newVal.tags,
        promo_video: newVal.promo_video || "",
    })
})

const { progress,
    uploadImage, deleteImage, } = useCloudflareImage()


const coverImage = ref('')
const coverUploader = ref(null)
const chooseCover = () => {
    coverUploader.value.click()
}


const uploadBooksCover = async (e) => {
    const file = e.target.files[0]

    if (form.values.image) {
        await deleteImage(form.values.image)
    }

    const imageUrl = await uploadImage(file, 'cover/')
    form.setFieldValue('image', imageUrl)

}

watch(teachers, (newVal) => {
    let selected = newVal.filter(a => a.selected).map(a => a.id)
    form.setFieldValue('teachers', selected)
})

onMounted(() => {
    if (existingCourse.value) {

        if (existingCourse.value.teachers) {
            teachers.value.forEach(teacher => {
                teacher.selected = existingCourse.value.teachers.some(t => t.teacherId === teacher.id)
            })
        }
    }
})

</script>

<style lang="scss" scoped></style>