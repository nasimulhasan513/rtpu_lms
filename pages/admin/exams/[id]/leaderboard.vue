<template>
    <AppContainer>


        <div class="max-w-3xl mx-auto print:w-screen print:scale-95">
            <div class="text-center">
                <h1 class="text-3xl font-bold text-primary"> {{ courseName }} </h1>
                <h2 class="text-2xl font-bold">Leaderboard</h2>
                <p class="text-lg text-gray-500"> {{ examTitle }} </p>
            </div>
            <div v-if="leaderboard.length > 0" class="pt-2 mt-12 mb-8">
                <ExamTopRankers :rankers="leaderboard.slice(0, 3)" />
            </div>

            <div class="flex gap-3 print:hidden">
                <div class="relative flex-1 mb-4">
                    <Input type="text" placeholder="Search by name or institute..."
                        class="pl-10 dark:bg-gray-800 dark:text-white" v-model="presearch" />
                    <Icon name="lucide:search"
                        class="absolute text-gray-400 transform -translate-y-1/2 dark:text-gray-300 left-3 top-1/2"
                        size="20" />
                </div>
                <AppButton :loading="recalculating" label="Recalculate" variant="outline" @click="recalcualteResults" />
                <Button variant="outline" aria-label="Home" @click="printLeaderboard">
                    Export PDF
                </Button>
                <Button variant="outline" aria-label="Home" @click="exportCSV">
                    Export CSV
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
                            <TableHead class="text-center dark:text-gray-300">
                                <LeaderboardMarks />
                            </TableHead>

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
                                <div class="flex items-center" @click="navigateTo(`/admin/users/${rank.user.id}`)">
                                    <Avatar class="w-8 h-8 mr-2">
                                        <AvatarImage :src="rank.user.image" :alt="rank.user.name" />
                                        <AvatarFallback>
                                            {{ rank.user.name.split(' ').map(n => n[0]).join('') }}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span class="p-1 rounded-md cursor-pointer dark:text-gray-300 hover:text-primary "
                                        @click="navigateTo(`/admin/users/${rank.user.id}?course=${courseSlug}`)">{{
                    rank.user.name }}</span>
                                </div>
                            </TableCell>
                            <TableCell class="dark:text-gray-300">{{ rank.user.institute }}</TableCell>
                            <TableCell class="font-semibold text-right dark:text-gray-300">
                                <div class="flex flex-col items-center">
                                    <div class="flex items-center justify-center"> <span
                                            class="text-lg font-semibold">{{ rank.marks }}</span>

                                        <LeaderboardBrakedown :rank="rank" :passMark="passMark" :examRank="i + 1" />
                                    </div>
                                    <div class="flex items-center space-x-2 text-xs">
                                        <span class="flex items-center text-green-500">
                                            <Icon name="lucide:circle-check" class="mr-1" size="14" />
                                            {{ rank.correct }}
                                        </span>
                                        <span class="flex items-center text-red-500">
                                            <Icon name="lucide:circle-x" class="mr-1" size="14" />
                                            {{ rank.wrong }}
                                        </span>
                                        <span class="flex items-center text-gray-500">
                                            <Icon name="lucide:circle-minus" class="mr-1" size="14" />
                                            {{ rank.skipped }}
                                        </span>
                                    </div>
                                </div>
                            </TableCell>

                            <TableCell class="text-right dark:text-gray-300">
                                <span class="flex items-center justify-end">
                                    <Icon name="lucide:clock" class="mr-1 dark:text-gray-300" size="14" />
                                    {{ millisecToTime(rank.duration, examDuration) }}
                                </span>
                            </TableCell>
                            <TableCell class="text-right print:hidden">
                                <Button variant="destructive" size="sm" @click="deleteRanker(rank.id)">
                                    Delete
                                </Button>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>

            <div class="my-5">
                <AppLoader v-if="loading || status === 'pending'" />
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
import { useToast } from '~/components/ui/toast'

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
const courseSlug = ref('')
const examDuration = ref(0)
const passMark = ref(0)
const hasMorePages = ref(false)
const loading = ref(true)
const toast = useToast()
const { data } = await useFetch(`/api/question/${route.params.id}/leaderboard`, {
    query: {
        search: search
    }
})
const fetchLeaderboard = async () => {
    loading.value = true
    try {

        if (data.value) {
            leaderboard.value = data.value.leaderboard
            examTitle.value = data.value.examData.title
            courseName.value = data.value.examData.courseExams.map(course => course.course.name).join(', ')
            courseSlug.value = data.value.examData.courseExams[0].course.slug
            examDuration.value = data.value.examData.duration
            passMark.value = data.value.examData.passMarks
            hasMorePages.value = page.value < data.value.pagination.totalPages
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
            hasMorePages.value = page.value < data.value.pagination.totalPages
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
    { distance: 100 }
)

watch(presearch, (value) => {
    search.value = value
    page.value = 1
    leaderboard.value = []
})

const printLeaderboard = () => {
    window.print()
}

const deleteRanker = async (id) => {
    try {
        const { data } = await useFetch(`/api/question/${route.params.id}/leaderboard/${id}`, {
            method: 'DELETE'
        })
        if (data.value) {
            leaderboard.value = leaderboard.value.filter(ranker => ranker.id !== id)
        }
        toast({
            title: 'Success',
            description: 'Ranker deleted successfully',
            variant: 'default'
        })
    } catch (error) {
        console.error('Error deleting ranker:', error)
        toast({
            title: 'Error',
            description: 'Error deleting ranker',
            variant: 'destructive'
        })
    }
}


const recalculating = ref(false)

const recalcualteResults = async () => {
    recalculating.value = true
    try {
        const { data } = await useFetch(`/api/admin/exams/${route.params.id}/recalculate`, {
            method: 'POST'
        })
        refresh()
    } catch (error) {
        console.error('Error recalculating results:', error)
        toast({
            title: 'Error',
            description: 'Error recalculating results',
            variant: 'destructive'
        })
    } finally {
        recalculating.value = false

    }
}

const exportCSV = () => {
    const headers = ['Rank', 'Name', 'Phone', 'Email', 'Institute', 'Marks', 'Duration', 'Correct', 'Wrong', 'Skipped', 'Passed'];
    const csv = [
        headers,
        ...leaderboard.value.map((rank, k) => [
            k + 1,
            rank.user.name,
            rank.user.phone,
            rank.user.email,
            rank.user.institute.replaceAll(',', ' '),
            rank.marks,
            millisecToTime(rank.duration),
            rank.correct,
            rank.wrong,
            rank.skipped,
            rank.passed ? 'Yes' : 'No'
        ])
    ];
    const csvContent = csv.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    if (link.download !== undefined) {
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `leaderboard_${route.params.id}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
}

</script>

<style lang="scss" scoped></style>