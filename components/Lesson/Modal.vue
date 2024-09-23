<template>
    <AppModal :isOpen="isOpen" title="Lesson" description="Add or update lesson" @onClose="onClose" v-if="isOpen">
        <AppLoader v-if="isLoading" />

        <div class="space-y-6">



            <form @submit="onSubmit">
                <div class="space-y-6">

                    <FormField v-slot="{ componentField }" name="title">
                        <FormItem>
                            <FormLabel>Title</FormLabel>
                            <FormControl>
                                <Input type="text" placeholder="Lesson topic/title" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>


                    <div class="grid grid-cols-2 gap-6">
                        <!-- select -->
                        <FormField v-slot="{ componentField }" name="subjectId">
                            <FormItem>
                                <FormLabel>Subject</FormLabel>

                                <Select v-bind="componentField">
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select subject" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup v-for="s in subjects" :key="s.id">
                                            <SelectItem :value="s.id">
                                                {{ s.name }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        </FormField>
                        <FormField v-slot="{ componentField }" name="chapterId">
                            <FormItem>
                                <FormLabel>Chapter</FormLabel>

                                <Select v-bind="componentField">
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select chapter" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectGroup v-for="c in chapters" :key="c.id">
                                            <SelectItem :value="c.id">
                                                {{ c.name }}
                                            </SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>

                                <FormMessage />
                            </FormItem>
                        </FormField>
                    </div>

                    <FormField v-slot="{ componentField }" name="source">
                        <FormItem>
                            <FormLabel>Source</FormLabel>

                            <Select v-bind="componentField">
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select source" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectItem value="youtube">
                                            Youtube
                                        </SelectItem>
                                        <SelectItem value="vimeo">
                                            Vimeo
                                        </SelectItem>
                                        <SelectItem value="vidstream">
                                            Streaming
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="teacherId">
                        <FormItem>
                            <FormLabel>Teacher</FormLabel>

                            <Select v-bind="componentField">
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select teacher" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectGroup v-for="teacher in teachers" :key="teacher.id">
                                        <SelectItem :value="teacher.id">
                                            {{ teacher.name }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="content">
                        <FormItem>
                            <FormLabel>Content</FormLabel>
                            <FormControl>
                                <Input placeholder="Class link" v-bind="componentField" />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <div>
                        <Label>PDF Lecture Sheet</Label>
                        <Input type="file" accept=".pdf" placeholder="PDF Lecture Sheet" @change="uploadFile" />
                    </div>

                    <FormField v-slot="{ componentField }" name="is_downloadable">
                        <FormItem class="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                                <Checkbox :checked="form.values.is_downloadable"
                                    @click="form.setFieldValue('is_downloadable', !form.values.is_downloadable)" />
                            </FormControl>
                            <div class="space-y-1 leading-none">
                                <FormLabel>Downloadable</FormLabel>
                                <FormDescription>
                                    Check this box if you want to make this Lecture Sheet downloadable.
                                </FormDescription>
                            </div>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                    <FormField v-slot="{ componentField }" name="is_archive">
                        <FormItem class="flex flex-row items-start p-4 space-x-3 space-y-0 border rounded-md">
                            <FormControl>
                                <Checkbox :checked="form.values.is_archive"
                                    @click="form.setFieldValue('is_archive', !form.values.is_archive)" />
                            </FormControl>
                            <div class="space-y-1 leading-none">
                                <FormLabel>Archive</FormLabel>
                                <FormDescription>
                                    Check this box if you want to archive this lesson.
                                </FormDescription>
                            </div>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
                <div class="flex flex-col gap-2 py-6">
                    <div class="flex flex-row items-center w-full gap-4">
                        <Button type="submit" class="w-full" :disabled="isLoading">
                            {{ initialValues?.id ? 'Update' : 'Create' }} a lesson
                        </Button>
                    </div>
                </div>
            </form>
        </div>

    </AppModal>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { LessonSchema } from '~/schema/lesson.schema';
import { useTeachers } from '@/composables/useTeachers';

const { subjects } = useSubject()

const chapters = ref([])

const { isOpen, onClose, courseIds, initialValues } = useLesson()

const formSchema = toTypedSchema(LessonSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        title: initialValues.value.title || "",
        subjectId: initialValues.value.subjectId || "",
        chapterId: initialValues.value.chapterId || "",
        source: initialValues.value.source || "",
        content: initialValues.value.content || "",
        pdf: initialValues.value.pdf || "",
        courseIds: [...courseIds.value],
        is_archive: initialValues.value.is_archive || false,
        is_downloadable: initialValues.value.is_downloadable || false,
        teacherId: initialValues.value.teacherId || "",
    }
})
const pdf = ref(null)
const isLoading = ref(false)
const { toast } = useToast()

const { teachers } = useTeachers()

const { uploadImage, deleteImage } = useCloudflareImage()

const onSubmit = form.handleSubmit(async (values) => {
    try {
        isLoading.value = true
        if (pdf.value) {
            let pdfurl = await uploadImage(pdf.value, 'lecture_sheet')
            values.pdf = pdfurl
        }

        if (initialValues.value?.id) {
            if (initialValues.value.pdf && values.pdf && initialValues.value.pdf !== values.pdf) {
                await deleteImage(initialValues.value.pdf)
            }
            await $fetch(`/api/admin/lessons/${initialValues.value.id}`, {
                method: 'PUT',
                body: values
            })
        } else {
            await $fetch('/api/admin/lessons', {
                method: 'POST',
                body: values
            })
        }

        refreshNuxtData('admin-lessons')
        onClose()
    } catch (error) {
        console.error(error)
        toast({
            title: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})

watch(() => initialValues.value, (value) => {
    if (value) {
        form.setValues({
            title: value.title,
            subjectId: value.subjectId,
            chapterId: value.chapterId,
            source: value.source,
            content: value.content,
            pdf: value.pdf,
            courseIds: [...courseIds.value],
            is_archive: value.is_archive || false,
            is_downloadable: value.is_downloadable || false,
            teacherId: value.teacherId,
        })
    }
}, {
    immediate: true,
    deep: true
})

watch(form.values, (value) => {
    if (form.values.subjectId) {
        chapters.value = subjects.value.find(s => s.id === form.values.subjectId).chapters
    }
}, {
    deep: true
})

const uploadFile = (e) => {
    pdf.value = e.target.files[0]
}




</script>
<style lang="scss" scoped></style>