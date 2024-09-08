<template>
    <Card class="w-full">
        <CardHeader>
            <CardTitle class="text-lg font-semibold line-clamp-2">
                {{ chapter.name }}
            </CardTitle>
        </CardHeader>

        <CardFooter class="flex justify-end gap-2">
            <Button variant="outline" size="sm" @click="editChapter">
                <Icon name="tabler:file-pencil" class="w-4 h-4 mr-1" />
                Edit
            </Button>
            <Button variant="destructive" size="sm" @click="deleteChapter">
                <Icon name="lucide:trash" class="w-4 h-4 mr-1" />
                Delete
            </Button>
        </CardFooter>
    </Card>
</template>

<script setup>
const props = defineProps({
    chapter: {
        type: Object,
        required: true
    }
})

const { onOpen: chapterOpen } = useChapter()

const editChapter = () => {
    chapterOpen({ subjectId: props.chapter.subjectId, initialValues: props.chapter })
}

const deleteChapter = async () => {
    const { toast } = useToast()
    try {
        await $fetch(`/api/admin/subjects/chapter/${props.chapter.id}`, {
            method: 'DELETE'
        })
        refreshNuxtData('subjects')
        toast({
            title: 'Chapter deleted',
            description: 'The chapter has been successfully deleted.',
        })
    } catch (error) {
        console.error(error)
        toast({
            title: 'Error',
            description: 'Failed to delete the chapter. Please try again.',
            variant: 'destructive'
        })
    }
}
</script>

<style lang="scss" scoped></style>