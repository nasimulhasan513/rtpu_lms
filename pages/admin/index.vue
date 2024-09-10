<template>
  <div class="flex flex-col w-full gap-4">
    <div class="flex flex-wrap items-center justify-between gap-2">
      <h2 class="text-3xl font-bold tracking-tight">
        Dashboard
      </h2>
      <!-- <div class="flex items-center space-x-2">
        <BaseDateRangePicker v-model="dateRange" />
        <Button @click="fetchDashboardData">Update</Button>
      </div> -->
    </div>
    <main class="flex flex-col flex-1 gap-4 md:gap-8">
      <div class="grid gap-4 lg:grid-cols-4 md:grid-cols-2 md:gap-8">
        <Card v-for="(stat, index) in stats" :key="index">
          <CardHeader class="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle class="text-sm font-medium">
              {{ stat.title }}
            </CardTitle>
            <Icon :name="stat.icon" class="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div class="text-2xl font-bold">
              {{ stat.value }}
            </div>
          </CardContent>
        </Card>
      </div>
      <div class="grid gap-4 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
        <Card class="xl:col-span-2">
          <CardHeader class="flex flex-row items-center">
            <div class="grid gap-2">
              <CardTitle>Recent Enrollments</CardTitle>
              <CardDescription>
                Latest course enrollments.
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow v-for="enrollment in dashboardData.recentEnrollments" :key="enrollment.id">
                  <TableCell>
                    <div class="font-medium">{{ enrollment.student }}</div>
                    <div class="text-sm text-muted-foreground">{{ enrollment.email }}</div>
                  </TableCell>
                  <TableCell>{{ enrollment.course }}</TableCell>
                  <TableCell>{{ new Date(enrollment.date).toLocaleDateString() }}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Recent Exam Submissions</CardTitle>
          </CardHeader>
          <CardContent class="grid gap-4">
            <div v-for="submission in dashboardData.recentExamSubmissions" :key="submission.id"
              class="flex items-center gap-4">
              <Avatar class="hidden h-9 w-9 sm:flex">
                <AvatarFallback>{{ getInitials(submission.student) }}</AvatarFallback>
              </Avatar>
              <div class="grid gap-1">
                <p class="text-sm font-medium leading-none">{{ submission.student }}</p>
                <p class="text-sm text-muted-foreground">{{ submission.exam }}</p>
              </div>
              <div class="ml-auto font-medium">{{ submission.marks }}</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  </div>
</template>

<script setup>

definePageMeta({
  layout: 'admin',
  middleware: 'admin'
})
const { data: dashboardData, status, error, refresh } = await useFetch('/api/admin/dashboard', {

})
const dateRange = ref({ start: '', end: '' })

const stats = computed(() => [
  { title: 'Total Users', value: dashboardData.value.totalUsers, icon: 'lucide:users' },
  { title: 'Total Courses', value: dashboardData.value.totalCourses, icon: 'lucide:book-open' },
  { title: 'Total Enrollments', value: dashboardData.value.totalEnrollments, icon: 'lucide:graduation-cap' },
  { title: 'Total Assignments', value: dashboardData.value.totalAssignments, icon: 'lucide:clipboard-list' },
  { title: 'Assignment Submissions', value: dashboardData.value.totalAssignmentSubmissions, icon: 'lucide:file-check' },
  { title: 'Total Exams', value: dashboardData.value.totalExams, icon: 'lucide:file-question' },
  { title: 'Exam Submissions', value: dashboardData.value.totalExamSubmissions, icon: 'lucide:pen-tool' },
])

const fetchDashboardData = async () => {
  const { data } = await useFetch('/api/admin/dashboard', {
    query: {
      startDate: dateRange.value.start,
      endDate: dateRange.value.end
    }
  })
  if (data.value) {
    dashboardData.value = data.value
  }
}

const getInitials = (name) => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase()
}

onMounted(fetchDashboardData)
</script>
