<template>
    <div>


        <div v-if="status === 'success'" class="grid gap-5 md:grid-cols-3">
            <div v-for="c in data.body" :key="c.id">
                <Card class="w-full max-w-md overflow-hidden rounded-lg">
                    <div class="relative h-48 md:h-56 lg:h-64">
                        <NuxtImg :src="c.image" :alt="c.name" class="object-cover w-full h-full" width="384"
                            height="256" />

                    </div>
                    <h2 class="text-xl font-semibold text-center">
                        {{ c.name }}
                    </h2>
                    <div class="flex justify-center gap-3 mb-3 text-center">
                        <p class="text-lg font-semibold text-red-500 line-through">
                            Tk. {{ c.regular_price }}
                        </p>
                        <p class="text-lg font-semibold text-green-500">
                            Tk. {{ c.sale_price }}
                        </p>

                    </div>
                    <div class="flex justify-center gap-3 pb-5">

                        <Button variant="outline" @click="navigateTo(`/admin/courses/${c.id}/lessons`)">
                            Lessons
                        </Button>
                        <Button variant="outline" @click="navigateTo(`/admin/courses/${c.id}/students`)">
                            Students
                        </Button>
                        <Button v-if="hasRole('admin')" variant="secondary"
                            @click="navigateTo(`/admin/courses/${c.id}`)">
                            Edit
                        </Button>
                        <Button v-if="hasRole('admin')" variant="destructive" @click="handleDeleteCourse(c.id)">
                            Delete
                        </Button>


                    </div>
                </Card>
            </div>
        </div>
    </div>
    <CourseModal />
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

const { data, status, error, refresh } = await useFetch('/api/admin/courses', {
    key: 'courses',
})

const { toast } = useToast()

const handleDeleteCourse = async (courseId) => {
    if (confirm('Are you sure you want to delete this course?')) {
        try {

            await $fetch(`/api/admin/courses/${courseId}`, {
                method: 'DELETE'
            })



            toast({
                title: 'Course deleted successfully',
                variant: 'success'
            })
            refresh()
        } catch (error) {
            console.error('Error deleting course:', error)
            toast({
                title: 'Error deleting course',
                description: error.toString(),
                variant: 'destructive'
            })
        }
    }
}
</script>

<style lang="scss" scoped></style>