<template>
    <div>
        <div class="flex justify-between">
            <AppHeading title="Subjects" />
            <Button @click="onOpen">
                <Icon name="lucide:plus" />
                Add a subject
            </Button>
        </div>

        <div v-if="status === 'success'">

            <Card v-for="subject in data.body" class="relative w-full max-w-md shadow-sm bg-card text-card-foreground">
                <div class="flex items-center justify-between p-4 sm:p-6">
                    <div class="grid gap-1">
                        <h3 class="text-lg font-semibold">{{ subject.name }}</h3>

                    </div>

                </div>
                <Separator />
                <div class="grid gap-4 p-4 sm:p-6">

                    <div v-for="chapter in subject.chapters" :key="chapter.id" class="flex items-center">
                        <div class="flex-1">
                            <p class="text-lg">
                                {{ chapter.name }}
                            </p>
                        </div>
                        <div class="flex gap-3">
                            <Button variant="outline"
                                @click="chapterOpen({ subjectId: subject.id, initialValues: chapter })">
                                <Icon name="tabler:file-pencil" />
                            </Button>
                            <Button>
                                <Icon name="lucide:trash" />
                            </Button>
                        </div>
                    </div>


                </div>
                <Separator />
                <div class="flex justify-end gap-2 p-4 sm:p-6">
                    <Button variant="outline">Edit Subject</Button>
                    <Button variant="destructive">Delete Subject</Button>
                </div>
                <!-- <div class="absolute cursor-move top-2 left-2">
                    <Icon name="lucide:grip-vertical" class="w-5 h-5 text-muted-foreground" />
                </div> -->
            </Card>

        </div>

    </div>

    <SubjectModal />
    <SubjectChapterModal />

</template>

<script setup>

definePageMeta({
    layout: 'admin',
})

const { data, status, error, refresh } = await useFetch('/api/subjects', {
    key: 'subjects'
})


const { onOpen } = useSubject()

const { onOpen: chapterOpen } = useChapter()

</script>

<style lang="scss" scoped></style>