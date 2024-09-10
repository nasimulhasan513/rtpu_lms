<template>
    <div class="space-y-6 lg:flex lg:space-x-6 lg:space-y-0" v-if="status == 'success'">

        <div class="flex flex-col overflow-y-auto lg:w-2/3 scrollbar-hide">
            <div class="w-full mx-auto overflow-hidden rounded-md aspect-video">
                <LessonVideoPlayer :src="lesson.content" class="w-full h-full" />
            </div>

            <div v-if="lesson.pdf">
                <div class="lg:hidden">
                    <Collapsible v-slot="{ open }">
                        <CollapsibleTrigger asChild>
                            <Card class="flex-grow mt-6 overflow-hidden cursor-pointer">
                                <CardHeader>
                                    <div class="flex items-center justify-between">
                                        <div class="flex items-center">
                                            <h2 class="text-lg font-semibold">
                                                লেকচার শিট
                                            </h2>
                                            <Icon :name="open ? 'lucide:chevron-up' : 'lucide:chevron-down'"
                                                class="w-5 h-5 ml-2" />
                                        </div>
                                        <Button size="sm" @click.stop="downloadPdf" v-if="lesson.is_downloadable">
                                            <Icon name="lucide:download" class="w-4 h-4 mr-2" />
                                            ডাউনলোড করো
                                        </Button>
                                    </div>
                                </CardHeader>
                            </Card>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                            <Card class="flex-grow mt-2 overflow-hidden">
                                <CardContent class="h-full">
                                    <div class="mb-4">
                                        <ClientOnly>
                                            <Suspense>
                                                <template #default>
                                                    <VuePdfEmbed v-if="VuePdfEmbed" :source="lesson.pdf"
                                                        class="w-full h-full border-0" />
                                                </template>
                                                <template #fallback>
                                                    <div>Loading PDF viewer...</div>
                                                </template>
                                            </Suspense>
                                        </ClientOnly>
                                    </div>
                                </CardContent>
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>
                </div>
                <div class="hidden lg:block">
                    <Card class="flex-grow mt-6 overflow-hidden">
                        <CardHeader>
                            <div class="flex items-center justify-between">
                                <h2 class="text-lg font-semibold">
                                    লেকচার শিট
                                </h2>
                                <Button size="sm" @click="downloadPdf" v-if="lesson.is_downloadable">
                                    <Icon name="lucide:download" class="w-4 h-4 mr-2" />
                                    ডাউনলোড করো
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent class="h-full">
                            <div class="mb-4">
                                <ClientOnly>
                                    <Suspense>
                                        <template #default>
                                            <VuePdfEmbed v-if="VuePdfEmbed" :source="lesson.pdf"
                                                class="w-full h-full border-0" />
                                        </template>
                                        <template #fallback>
                                            <div>Loading PDF viewer...</div>
                                        </template>
                                    </Suspense>
                                </ClientOnly>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>

        <div class="space-y-4 lg:w-1/3">
            <div class="sticky space-y-4 top-14">
                <Card class="p-3">
                    <CardHeader>
                        <CardTitle class="font-semibold ">
                            ক্লাস সম্পর্কিত তথ্য
                        </CardTitle>

                    </CardHeader>
                    <CardContent>
                        <div class="space-y-2">
                            <div class="flex items-center">
                                <BookIcon class="w-5 h-5 mr-2 text-primary" />
                                <span class="font-medium">টপিক:</span>
                                <span class="ml-2">{{ lesson.title }}</span>

                            </div>
                            <div class="flex items-center">
                                <BookOpenIcon class="w-5 h-5 mr-2 text-primary" />
                                <span class="font-medium">বিষয়:</span>
                                <span class="ml-2">{{ lesson.subjectName }}</span>
                            </div>
                            <div class="flex items-center">
                                <BookmarkIcon class="w-5 h-5 mr-2 text-primary" />
                                <span class="font-medium">অধ্যায়:</span>
                                <span class="ml-2">{{ lesson.chapterName }}</span>
                            </div>

                        </div>
                    </CardContent>
                </Card>
                <Card class="p-3">
                    <CardHeader>
                        <CardTitle>
                            শিক্ষক
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div class="flex items-center gap-4">
                            <Avatar>
                                <AvatarImage :src="lesson.teacherImage" class="object-cover object-top" />
                                <AvatarFallback>
                                    {{ lesson.teacherName.split(' ').map(n => n[0]).join('') }}
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <p class="text-base font-semibold">
                                    {{ lesson.teacherName }}
                                </p>
                                <p class="text-sm text-muted-foreground">
                                    {{ lesson.teacherDesignation }}
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>


                <div class="grid grid-cols-2 gap-2">
                    <Button @click="markAsComplete" :disabled="isCompleting"
                        :variant="progress.completed ? 'default' : 'outline'">
                        <Icon name="lucide:check-circle" class="w-4 h-4 mr-2" />
                        ক্লাসটি করা হয়েছে
                    </Button>
                    <Button :variant="progress.bookmark ? 'default' : 'outline'" @click="toggleBookmark">
                        <Icon name="lucide:bookmark" class="w-4 h-4 mr-2" />
                        {{ progress.bookmark ? 'বুকমার্ক হয়েছে' : 'বুকমার্ক করো' }}
                    </Button>
                </div>

                <div class="space-y-2">
                    <div>
                        <Label for="note">নোটঃ</Label>
                        <Textarea id="note" v-model="progress.note" class="mt-1" />
                    </div>

                    <div class="flex justify-end">
                        <Button @click="saveNote" :disabled="isSavingNote">
                            {{ isSavingNote ? 'সাবমিট হচ্ছে...' : 'সাবমিট করো' }}
                        </Button>
                    </div>
                </div>

            </div>
        </div>
    </div>
    <div v-else-if="status == 'pending'">
        <div class="flex items-center justify-center h-full">
            <AppLoader />
        </div>
    </div>
    <div v-else-if="status == 'error'">
        <div class="flex items-center justify-center h-full">
            <p class="text-lg font-semibold">
                কোনো লেকচার পাওয়া যায়নি
            </p>
        </div>
    </div>
</template>

<script setup>
import { BookOpenIcon, BookmarkIcon, BookIcon } from 'lucide-vue-next'
import { useToast } from '~/components/ui/toast'

const VuePdfEmbed = shallowRef(null)
onMounted(async () => {
    VuePdfEmbed.value = (await import('vue-pdf-embed')).default
})

definePageMeta({
    layout: 'course',
    middleware: 'enrolled'
})

const route = useRoute()
const { data, status, error, refresh } = await useFetch(`/api/courses/${route.params.slug}/lessons/${route.params.id}`)

const lesson = computed(() => data.value?.lesson || {})
const progress = ref(data.value?.progress)

const { toast } = useToast()
const isCompleting = ref(false)
const isSavingNote = ref(false)

const updateProgress = useDebounceFn(async () => {
    try {
        const { data } = await useFetch(`/api/courses/${route.params.slug}/lessons/progress`, {
            method: 'POST',
            body: {
                lessonId: lesson.value.id,
                ...progress.value,
            },
        })
        progress.value = data.value.progress
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to update progress',
            variant: 'destructive',
        })
    }
}, 500)


const markAsComplete = async () => {
    isCompleting.value = true
    progress.value.completed = true
    await updateProgress()
    isCompleting.value = false
    toast({
        title: 'Success',
        description: 'Lesson marked as complete',

    })
}

const downloadPdf = () => {
    window.open(lesson.value.pdf, '_blank')
}

const toggleBookmark = async () => {
    progress.value.bookmark = !progress.value.bookmark
    await updateProgress()
    toast({
        title: 'Success',
        description: progress.value.bookmark ? 'Lesson bookmarked' : 'Bookmark removed',

    })
}

const saveNote = async () => {
    isSavingNote.value = true
    await updateProgress()
    isSavingNote.value = false
    toast({
        title: 'Success',
        description: 'Note saved successfully',

    })
}

</script>
