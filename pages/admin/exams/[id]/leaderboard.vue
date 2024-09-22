<template>
    <AppContainer>
        <div class="max-w-3xl mx-auto print:w-screen print:scale-95">
            <div class="text-center">
                <h1 class="text-3xl font-bold text-primary"> {{ courseName }} </h1>
                <h2 class="text-2xl font-bold text-primary">Leaderboard</h2>
                <p class="text-lg text-gray-500"> {{ examTitle }} </p>
            </div>
            <div v-if="leaderboard.length > 0" class="pt-2 mt-12 mb-8">
                <ExamTopRankers :rankers="leaderboard.slice(0, 3)" />
            </div>

            <div class="flex gap-3">
                <div class="relative flex-1 mb-4 print:hidden">
                    <Input type="text" placeholder="Search by name or institute..."
                        class="pl-10 dark:bg-gray-800 dark:text-white" v-model="presearch" />
                    <Icon name="lucide:search"
                        class="absolute text-gray-400 transform -translate-y-1/2 dark:text-gray-300 left-3 top-1/2"
                        size="20" />

                </div>

                <Button variant="outline" class="print:hidden" aria-label="Home" @click="printLeaderboard">
                    Export PDF
                </Button>
            </div>


            <div v-if="leaderboard.length > 0"
                class="overflow-hidden bg-white border rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead class="w-[50px] dark:text-gray-300">Rank</TableHead>
                            <TableHead class="dark:text-gray-300">Participant</TableHead>
                            <TableHead class="dark:text-gray-300">Institute</TableHead>
                            <TableHead class="text-right dark:text-gray-300">Marks</TableHead>
                            <TableHead class="text-right dark:text-gray-300">Duration</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow v-for="(rank, i) in leaderboard" :key="i"
                            class="hover:bg-gray-50 dark:hover:bg-gray-700">
                            <TableCell class="font-medium dark:text-gray-300">
                                {{ i + 1 }}
                            </TableCell>
                            <TableCell>
                                <div class="flex items-center">
                                    <img :src="rank.user.image" :alt="rank.user.name"
                                        class="w-8 h-8 mr-2 rounded-full print:hidden" />
                                    <span class="dark:text-gray-300">{{ rank.user.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell class="dark:text-gray-300">{{ rank.user.institute }}</TableCell>
                            <TableCell class="font-semibold text-right dark:text-gray-300">{{ rank.marks }}</TableCell>
                            <TableCell class="text-right dark:text-gray-300">
                                <span class="flex items-center justify-end">
                                    <Icon name="lucide:clock" class="mr-1 dark:text-gray-300" size="14" />
                                    {{ millisecToTime(rank.duration, examDuration) }}
                                </span>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div class="my-5">
                <AppLoader v-if="loading" />
                <AppEmptyState v-if="!loading && leaderboard.length === 0" />
            </div>

            <Button v-if="hasMorePages" @click="loadMoreLeaderboard" :disabled="loadingMore"
                class="w-full mt-4 dark:bg-gray-700 dark:text-white">
                {{ loadingMore ? 'Loading...' : 'Load More' }}
            </Button>
        </div>
    </AppContainer>
</template>

<script setup>
import { useInfiniteScroll } from '@vueuse/core'

definePageMeta({
    layout: 'admin'
})

const route = useRoute()
const search = ref('')
const presearch = ref('')
const page = ref(1)
const pageSize = 25
const leaderboard = ref([])
const loadingMore = ref(false)
const examTitle = ref('')
const courseName = ref('')
const examDuration = ref(0)
const hasMorePages = ref(false)
const loading = ref(true)

const fetchLeaderboard = async () => {
    loading.value = true
    try {
        const { data } = await useFetch(`/api/question/${route.params.id}/leaderboard`, {
            query: {
                search: search.value,
                page: page.value,
                pageSize
            },
        })
        if (data.value) {
            leaderboard.value = data.value.leaderboard
            examTitle.value = data.value.examData.title
            courseName.value = data.value.examData.courseExams[0].course.name
            examDuration.value = data.value.examData.duration
            hasMorePages.value = data.value.pagination.currentPage < data.value.pagination.totalPages
        }
    } catch (error) {
        console.error('Error fetching leaderboard:', error)
    } finally {
        loading.value = false
    }
}

onMounted(fetchLeaderboard)

const loadMoreLeaderboard = async () => {
    if (loadingMore.value || !hasMorePages.value) return
    loadingMore.value = true
    page.value += 1
    try {
        const { data } = await useFetch(`/api/question/${route.params.id}/leaderboard`, {
            query: {
                search: search.value,
                page: page.value,
                pageSize
            },
        })
        if (data.value) {
            leaderboard.value = [...leaderboard.value, ...data.value.leaderboard]
            hasMorePages.value = data.value.pagination.currentPage < data.value.pagination.totalPages
        }
    } catch (error) {
        console.error('Error loading more leaderboard data:', error)
    } finally {
        loadingMore.value = false
    }
}

useInfiniteScroll(
    window,
    async () => {
        if (!loading.value && !loadingMore.value && hasMorePages.value) {
            await loadMoreLeaderboard()
        }
    },
    { distance: 10 }
)

debouncedWatch(presearch, (value) => {
    search.value = value
    page.value = 1
    leaderboard.value = []
    fetchLeaderboard()
}, { debounce: 500 })

const printLeaderboard = () => {
    window.print()
}



</script>

<style lang="scss" scoped></style>