<template>
    <div>
        <AppHeading title="Create new course" subtitle="Fill up the form to create a new course" />

        <div class="space-y-6">
            <form @submit="onSubmit">
                <div class="space-y-6">
                    <pre>
            {{ form.errors }}
          </pre>
                    <pre>
            {{ form.values }}
          </pre>
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
                                <FormField v-slot="{ componentField }" name="category_id">
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
                                                    <SelectItem value="published"> Published </SelectItem>
                                                    <SelectItem value="draft"> Draft </SelectItem>
                                                    <SelectItem value="prebooking">
                                                        Prebooking
                                                    </SelectItem>
                                                    <SelectItem value="archieved"> Archieved </SelectItem>
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
                                        This will be used to generate the course link. It should be
                                        unique and contain only alphabets, numbers, and hyphens.
                                    </FormDescription>
                                </FormItem>
                            </FormField>
                        </div>

                        <div @click="chooseCover"
                            class="relative flex flex-col items-center justify-center col-span-2 gap-4 p-20 transition bg-white border-2 cursor-pointer dark:bg-muted/20 hover:opacity-70 border-nuetral-300 text-nuetral-600">
                            <input type="file" class="hidden" accept="image/*" ref="coverUploader"
                                @change="uploadBooksCover" />

                            <Icon v-if="!coverImage" name="lucide:image-plus" size="50" />
                            <div v-if="!coverImage" class="text-lg font-semibold">
                                Upload cover image
                            </div>
                            <div v-else class="absolute inset-0 w-full h-full">
                                <NuxtImg :src="coverImage" class="object-cover w-full h-full" alt="Book Cover" />
                            </div>
                        </div>
                    </div>

                    <div v-if="status === 'success' && teachers.length > 0">
                        <h2 class="text-2xl font-semibold">Select Teachers</h2>
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
                            <FormDescription> Set keywords for seo. </FormDescription>
                            <FormMessage />
                        </FormItem>
                    </FormField>
                </div>
                <div class="py-6">
                    <Button type="submit"> Create new Course </Button>
                </div>
            </form>
        </div>
    </div>
</template>

<script setup>
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useToast } from "@/components/ui/toast/use-toast";
import { CourseSchema } from "~/schema/course.schema";

definePageMeta({
    layout: "admin",
    middleware: "admin",
});

const { data: teachers, status } = await useAsyncData(
    async () => await $fetch("/api/admin/teachers")
);
const { data: categories } = await useAsyncData(
    async () => await $fetch("/api/admin/courses/categories")
);

const formSchema = toTypedSchema(CourseSchema);

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        title: "",
        slug: "",
        short_description: "",
        description: "",
        image: "",
        sale_price: "",
        regular_price: "",
        status: "",
        duration: "",
        enrolled: "",
        fb_group: "",
        tg_group: "",

        category_id: "",
        teachers: [],
        keywords: [],
    },
});

const isLoading = ref(false);
const { toast } = useToast();
const onSubmit = form.handleSubmit(async () => {
    console.log(form.values);
    try {
        isLoading.value = true;
        const { data, error } = await useAsyncData(() =>
            $fetch("/api/admin/courses", {
                method: "POST",
                body: form.values,
            })
        );
        if (error.value) {
            return toast({
                title: error.value.statusCode.toString(),
                description: error.value.statusMessage,
                variant: "destructive",
            });
        }

        toast({
            title: "Book created successfully",
        });
        navigateTo("/admin/courses");
        return;
    } catch (error) {
        console.log(error);
        return toast({
            title: error.toString(),
            variant: "destructive",
        });
    } finally {
        isLoading.value = false;
    }
});

watch(teachers.value, (newVal) => {
    let selected = newVal.filter((a) => a.selected).map((a) => a.id);
    form.setFieldValue("teachers", selected);
    console.log(form.values);
});

const { progress, uploadImage, deleteImage } = useCloudflareImage();

const coverImage = ref("");
const coverUploader = ref(null);
const chooseCover = () => {
    coverUploader.value.click();
};

const uploadBooksCover = async (e) => {
    const file = e.target.files[0];

    if (coverImage.value) {
        await deleteImage(coverImage.value);
    }

    const imageUrl = await uploadImage(file, "cover/");
    coverImage.value = imageUrl;
    form.setFieldValue("image", imageUrl);
};

watch(teachers, (newVal) => {
    let selected = newVal.filter((a) => a.selected).map((a) => a.id);
    form.setFieldValue("teachers", selected);
});
</script>

<style lang="scss" scoped></style>
