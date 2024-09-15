<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

import {
    Search,
} from 'lucide-vue-next'

const perpage = ref('10')
const search = ref('')
const currentPage = ref(1)
const { data, status, error, refresh } = await useFetch('/api/admin/users/contributors', {
    key: 'users',
    query: {
        limit: perpage,
        page: currentPage,
        search: search
    }
})

const courses = ref([])
const selectedCourse = ref('')

// Fetch courses
const fetchCourses = async () => {
    try {
        const { data: coursesData } = await useFetch('/api/courses')
        courses.value = coursesData.value
    } catch (error) {
        console.error('Error fetching courses:', error)
    }
}

onMounted(fetchCourses)

const { toast } = useToast()


const assignContributor = async (userId: string) => {
    if (!selectedCourse.value) {
        toast({
            title: 'Error',
            description: 'Please select a course',
            variant: 'destructive'
        })
        return
    }

    try {
        const { data } = await useFetch('/api/admin/users/course', {
            method: 'POST',
            body: {
                userId,
                courseId: selectedCourse.value,
                permission: 'EDIT' // You might want to make this dynamic if needed
            }
        })

        if (data.value?.success) {
            toast({
                title: 'Success',
                description: 'Contributor assigned successfully',
            })
            refresh()
        }
    } catch (error) {
        toast({
            title: 'Error',
            description: error.message || 'Failed to assign contributor',
            variant: 'destructive'
        })
    }
}

const removeContributor = async (id: string) => {
    try {
        const data = await $fetch('/api/admin/users/course', {
            method: 'DELETE',
            body: {
                id
            }
        })
        refresh()
    }
    catch (error) {
        toast({
            title: 'Error',
            description: error.message || 'Failed to remove contributor',
            variant: 'destructive'
        })
    }
}

const paginate = (page: number) => {
    currentPage.value = page
}

const presearch = ref('')


debouncedWatch(presearch, (value) => {
    search.value = value
}, { debounce: 500 })


</script>

<template>
    <div class="flex flex-col w-full min-h-screen bg-muted/40">

        <div class="flex flex-col sm:gap-4 sm:py-4 ">


            <main class="grid items-end flex-1 gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">


                <div class="flex items-end justify-between ">
                    <div class="relative">
                        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input v-model="presearch" type="search" placeholder="Search..."
                            class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]" />
                    </div>
                    <div class="flex items-end gap-3" v-if="status == 'success'">
                        <div>
                            <Label>
                                Per Page
                            </Label>
                            <Select v-model="perpage">
                                <SelectTrigger class="w-[180px] bg-white">
                                    <SelectValue placeholder="Filter Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Per Page</SelectLabel>
                                        <SelectItem v-for="p in ['10', '50', '100', '500']" :value="p" :key="p">
                                            {{ p }}
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>

                        </div>

                    </div>

                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Contributors</CardTitle>
                        <CardDescription>
                            Manage your contributors from here
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <Table v-if="status == 'success'">
                            <TableHeader>
                                <TableRow>

                                    <TableHead>Name</TableHead>
                                    <TableHead>Phone</TableHead>
                                    <TableHead class="hidden md:table-cell">
                                        Email
                                    </TableHead>

                                    <TableHead>
                                        Select Course
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="user in data?.users" :key="user.id">

                                    <TableCell class="font-medium">
                                        {{ user?.name }}
                                    </TableCell>
                                    <TableCell>
                                        {{ user?.phone }}
                                    </TableCell>
                                    <TableCell class="hidden md:table-cell">
                                        {{ user?.email }}
                                    </TableCell>



                                    <TableCell class="flex items-center">

                                        <Select v-model="selectedCourse">
                                            <SelectTrigger class="w-[180px]">
                                                <SelectValue placeholder="Select Course" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem v-for="course in courses" :key="course.id"
                                                    :value="course.id">
                                                    {{ course.name }}
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <Button @click="assignContributor(user.id)" class="ml-2">
                                            Assign
                                        </Button>
                                    </TableCell>
                                    <TableCell>

                                        <div v-if="user?.Contributor && user.Contributor.length > 0"
                                            class="flex flex-wrap gap-2">
                                            <Button v-for="contributor in user.Contributor" :key="contributor.id"
                                                variant="outline" size="sm" class="flex items-center">
                                                {{ contributor.course.name }}
                                                <Icon name="lucide:x" @click="removeContributor(contributor.id)"
                                                    class="w-4 h-4 ml-2 cursor-pointer" />
                                            </Button>
                                        </div>



                                    </TableCell>

                                </TableRow>
                            </TableBody>
                        </Table>
                        <AppLoader v-else />
                    </CardContent>
                    <CardFooter v-if="status == 'success'" class="flex justify-between">
                        <div class="text-xs text-muted-foreground">
                            Showing <strong>1-10</strong> of <strong>{{ data?.totalUsers }}</strong>
                            products
                        </div>
                        <div>
                            <Pagination v-slot="{ page }" @update:page="paginate"
                                :total="data?.totalUsers / perpage * 10" :sibling-count="1" show-edges
                                :default-page="data?.page">
                                <PaginationList v-slot="{ items }" class="flex items-center gap-1">
                                    <PaginationFirst />
                                    <PaginationPrev />

                                    <template v-for="(item, index) in items">
                                        <PaginationListItem v-if="item.type === 'page'" :key="index" :value="item.value"
                                            as-child>
                                            <Button class="w-10 h-10 p-0"
                                                :variant="item.value === page ? 'default' : 'outline'">
                                                {{ item.value }}
                                            </Button>
                                        </PaginationListItem>
                                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                                    </template>

                                    <PaginationNext />
                                    <PaginationLast />
                                </PaginationList>
                            </Pagination>
                        </div>
                    </CardFooter>
                </Card>
            </main>
        </div>
    </div>
</template>