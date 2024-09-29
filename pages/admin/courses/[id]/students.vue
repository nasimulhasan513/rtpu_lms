<script setup lang="ts">
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

import {
    File,
    MoreHorizontal,
    Search,
} from 'lucide-vue-next'

const perpage = ref('10')
const search = ref('')
const currentPage = ref(1)

const { id } = useRoute().params

interface User {
    id: string;
    name: string;
    email: string;
    image: string;
}

interface Enrollment {
    id: string;
    userId: string;
    courseId: string;
    transactionId: string;
    gateway_response: string | null;
    status: string;
    enrolledAt: string;
    couponId: string | null;
    categoryId: string | null;
    user: User;
    progress: {
        _count: {
            _all: number;
        };
        userId: string;
    };
}

interface ApiResponse {
    users: Enrollment[];
    totalUsers: number;
    page: number;
}

const { data, status, error, refresh } = await useFetch<ApiResponse>('/api/admin/users/course/' + id, {
    key: 'users',
    query: {
        limit: perpage,
        page: currentPage,
        search: search
    }
})

const { toast } = useToast()

const exportAsCSV = async () => {
    const enrollments = data.value?.users || []

    const headers = ['Name', 'Email', 'Enrolled At', 'Status', 'Progress']
    const csv = enrollments.map((enrollment) => {
        return [
            enrollment.user.name,
            enrollment.user.email,
            enrollment.enrolledAt,
            enrollment.status,
            enrollment.progress._count._all.toString()
        ].join(',')
    }).join('\n')

    const blob = new Blob([headers.join(',') + '\n' + csv], { type: 'text/csv' })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'users.csv'
    a.click()
    window.URL.revokeObjectURL(url)
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
                <CourseEnrollmentModal />

                <div class="flex items-end justify-between ">
                    <div class="relative">
                        <Search class="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input v-model="presearch" type="search" placeholder="Search..."
                            class="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[320px]" />
                    </div>
                    <div class="flex items-end gap-3" v-if="status == 'success'">
                        <Button variant="outline" class="gap-1">
                            Total: {{ data?.totalUsers }}
                        </Button>
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
                        <Button variant="outline" class="gap-1 " @click="exportAsCSV">
                            <File class="h-3.5 w-3.5" />
                            <span class="sr-only sm:not-sr-only sm:whitespace-nowrap">
                                Export
                            </span>
                        </Button>
                        <!-- <CourseEnrollmentModal /> -->
                    </div>

                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Students</CardTitle>
                        <CardDescription>
                            Manage your students from here
                        </CardDescription>
                    </CardHeader>
                    <CardContent>

                        <Table v-if="status === 'success'">
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Image</TableHead>
                                    <TableHead>Name</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Institute</TableHead>
                                    <TableHead>Enrolled At</TableHead>
                                    <TableHead>Lesson Progress</TableHead>
                                    <TableHead>
                                        <span class="sr-only">Actions</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                <TableRow v-for="enrollment in data?.users" :key="enrollment.id">
                                    <TableCell>

                                        <Avatar class="w-7 h-7">
                                            <AvatarImage :src="enrollment.user.image" :alt="enrollment.user.name" />
                                            <AvatarFallback>{{ enrollment.user.name.charAt(0) }}</AvatarFallback>
                                        </Avatar>
                                    </TableCell>
                                    <TableCell class="font-medium">
                                        {{ enrollment.user.name }}
                                    </TableCell>
                                    <TableCell>
                                        {{ enrollment.user.email }}
                                    </TableCell>
                                    <TableCell>
                                        {{ enrollment.user.institute }}
                                    </TableCell>
                                    <TableCell>
                                        {{ new Date(enrollment.enrolledAt).toLocaleDateString() }}
                                    </TableCell>

                                    <TableCell>
                                        {{ enrollment.progress._count._all }}
                                    </TableCell>
                                    <TableCell>
                                        <!-- ... existing action dropdown ... -->
                                    </TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                        <AppLoader v-else />
                    </CardContent>
                    <CardFooter v-if="status === 'success'" class="flex justify-between">
                        <div class="text-xs text-muted-foreground">
                            Showing <strong>1-{{ Math.min(Number(perpage), data?.totalUsers || 0) }}</strong> of
                            <strong>{{ data?.totalUsers }}</strong>
                            students
                        </div>
                        <div>
                            <Pagination v-slot="{ page }" @update:page="paginate"
                                :total="Math.ceil((data?.totalUsers || 0) / Number(perpage)) * 10" :sibling-count="1"
                                show-edges :default-page="data?.page || 1">
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