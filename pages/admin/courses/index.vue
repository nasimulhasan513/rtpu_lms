<template>
    <div>

        <div class="flex p-4 space-x-4 rounded-md" v-if="hasRole('admin')">
            <div class="p-4 text-center rounded-md bg-background">
                <p class="text-lg font-semibold ">
                    Total Revenue
                </p>
                <p class="text-xl font-bold ">
                    Tk. {{ totalRevenue }}
                </p>
            </div>
            <div class="p-4 text-center rounded-md bg-background">
                <p class="text-lg font-semibold ">
                    Total Revenue (Deep)
                </p>
                <p class="text-xl font-bold ">
                    Tk. {{ totalRevenue / 2 }}
                </p>
            </div>
            <div class="p-4 text-center rounded-md bg-background">
                <p class="text-lg font-semibold ">
                    Total Revenue (Sayem)
                </p>
                <p class="text-xl font-bold ">
                    Tk. {{ totalRevenue / 2 }}
                </p>
            </div>
        </div>
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
                    <div class="grid grid-cols-2 gap-4 p-2 m-3 text-center border rounded-md" v-if="hasRole('admin')">
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Shop Charge</p>
                            <p class="text-lg font-semibold text-green-500">
                                {{ c.shop_charge }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">SMS Charge</p>
                            <p class="text-lg font-semibold text-green-500">
                                {{ c.sms_charge }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Enrollments</p>
                            <p class="text-lg font-semibold text-red-500">
                                {{ c._count.enrollments+c.enrolled }}
                            </p>
                        </div>
                        <div>
                            <p class="text-sm font-medium text-muted-foreground">Total Shop Charge</p>
                            <p class="text-lg font-semibold text-red-500">
                                {{ (c._count.enrollments+c.enrolled) * c.shop_charge }}
                            </p>
                        </div>
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


const totalRevenue = computed(() => {
    return data.value.body.reduce((acc, course) => {
        return acc + ((course._count.enrollments + course.enrolled) * course.shop_charge)
    }, 0)
})



</script>

<style lang="scss" scoped></style>