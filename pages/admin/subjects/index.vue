<template>
    <div>
        <div class="flex justify-between">
            <AppHeading title="Subjects" />
            <Button @click="onOpen">
                <Icon name="lucide:plus" />
                Add a subject
            </Button>
        </div>

        <div v-if="status === 'success'" class="mt-5">
            <MasonryWall :items="data.body" :column-width="300" :gap="20">
                <template #default="{ item: subject }">
                    <Card class="relative w-full shadow-sm bg-card text-card-foreground">
                        <div class="flex items-center justify-between p-4 sm:p-6">
                            <div class="grid gap-1">
                                <h3 class="text-lg font-semibold">{{ subject.name }}</h3>
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
                        <Separator />
                        <div class="grid gap-4 p-4 sm:p-6">
                            <SubjectChapterShow v-for="chapter in subject.chapters" :key="chapter.id"
                                :chapter="chapter" />
                        </div>
                        <Separator />
                        <SubjectChapterCreate :subject="subject.id" />
                    </Card>
                </template>
            </MasonryWall>
        </div>
    </div>

    <SubjectModal />
    <SubjectChapterModal />
</template>

<script setup>
import MasonryWall from '@yeger/vue-masonry-wall'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

const { data, status, error, refresh } = await useFetch('/api/admin/subjects', {
    key: 'subjects'
})

const { onOpen } = useSubject()
const { onOpen: chapterOpen } = useChapter()
</script>

<style lang="scss" scoped></style>