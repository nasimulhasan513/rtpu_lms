<template>
  <div class="container px-4 py-8 mx-auto">
    <div class="flex items-center justify-between mb-8">
      <AppHeading
        title="Course Categories"
        subtitle="Create, Update or organize categories."
      />
      <Button @click="openModal(null)" size="sm">
        <Icon name="lucide:plus" class="mr-2" />
        Add Category
      </Button>
    </div>

    <div
      v-if="status === 'success'"
      class="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
    >
      <Card
        v-for="category in data"
        :key="category.id"
        class="overflow-hidden transition-shadow hover:shadow-lg"
      >
        <CardContent class="p-0">
          <div class="relative h-48">
            <NuxtImg
              :src="category.image"
              :alt="category.name"
              class="object-cover w-full h-full"
            />
          </div>
        </CardContent>
        <CardFooter
          class="flex justify-between px-3 py-2 space-x-2 border-t bg-gray-50"
        >
          <p class="text-sm text-gray-500">
            {{ category.name }}
          </p>
          <div class="flex items-center space-x-2">
            <Button @click="openModal(category)" variant="outline" size="sm">
              <Icon name="lucide:pencil" size="16" />
            </Button>
            <Button
              @click="deleteCategory(category.id)"
              variant="destructive"
              size="sm"
            >
              <Icon name="lucide:trash" size="16" />
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>

    <AppModal
      :isOpen="isOpen"
      :title="editingCategory ? 'Update Category' : 'Create Category'"
      :description="
        editingCategory ? 'Update existing category' : 'Create a new category'
      "
      @onClose="closeModal"
      v-if="isOpen"
    >
      <form @submit.prevent="onSubmit" class="space-y-6">
        <div class="grid">
          <ImageUpload
            :image="form.values.image"
            @upload="uploadCategoryLogo"
            label="Category Image"
            class="h-32"
          />

          <FormField v-slot="{ componentField }" name="name">
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>

          <FormField v-slot="{ componentField }" name="slug">
            <FormItem>
              <FormLabel>Link</FormLabel>
              <FormControl>
                <Input v-bind="componentField" />
              </FormControl>
              <FormMessage />
            </FormItem>
          </FormField>
        </div>
        <div class="grid grid-cols-3 gap-6"></div>
        <AppButton
          type="submit"
          class="w-full"
          :loading="isLoading"
          :label="editingCategory ? 'Update Category' : 'Create Category'"
          :loadingLabel="editingCategory ? 'Updating...' : 'Creating...'"
        />
      </form>
    </AppModal>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});
import { useForm } from "vee-validate";
import { toTypedSchema } from "@vee-validate/zod";
import { useToast } from "@/components/ui/toast/use-toast";
import { CategorySchema } from "~/schema/category.schema";

const { data, status, refresh } = useFetch("/api/admin/courses/categories");

const isOpen = ref(false);
const editingCategory = ref(null);

const closeModal = () => {
  isOpen.value = false;
  editingCategory.value = null;
  form.resetForm();
};

const openModal = (category = null) => {
  editingCategory.value = category;
  if (category) {
    form.setValues({
      name: category.name,
      slug: category.slug,
      image: category.image,
    });
  }
  isOpen.value = true;
};

const formSchema = toTypedSchema(CategorySchema);

const form = useForm({
  validationSchema: formSchema,
  initialValues: {
    name: "",
    image: "",
    slug: "",
  },
});

const isLoading = ref(false);
const { toast } = useToast();

const onSubmit = form.handleSubmit(async (values) => {
  try {
    isLoading.value = true;

    if (editingCategory.value) {
      await $fetch(
        `/api/admin/courses/categories/${editingCategory.value.id}`,
        {
          method: "PUT",
          body: values,
        }
      );
      toast({
        title: "Category updated successfully",
        variant: "success",
      });
    } else {
      await $fetch("/api/admin/courses/categories", {
        method: "POST",
        body: values,
      });
      toast({
        title: "Category created successfully",
        variant: "success",
      });
    }

    refresh();
    closeModal();
  } catch (error) {
    toast({
      title: "Error",
      description: error.toString(),
      variant: "destructive",
    });
  } finally {
    isLoading.value = false;
  }
});

const { uploadImage, deleteImage } = useCloudflareImage();

const logoUploader = ref(null);
const chooseLogo = () => {
  logoUploader.value.click();
};

const uploadCategoryLogo = async (e) => {
  const file = e.target.files[0];

  if (form.values.image) {
    await deleteImage(form.values.image);
  }

  const logoUrl = await uploadImage(file, "categories/logos/");
  form.setFieldValue("image", logoUrl);
};

const deleteCategory = async (categoryId) => {
  if (confirm("Are you sure you want to delete this category?")) {
    try {
      await $fetch(`/api/admin/courses/categories/${categoryId}`, {
        method: "DELETE",
      });
      toast({
        title: "Category deleted successfully",
        variant: "success",
      });
      refresh();
    } catch (error) {
      toast({
        title: "Error deleting category",
        description: error.toString(),
        variant: "destructive",
      });
    }
  }
};
</script>

<style lang="scss" scoped></style>
