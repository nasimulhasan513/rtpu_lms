<template>
    <div class="flex items-center">
        <div class="flex-1">
            <p class="text-lg">
                {{ chapter.name }}
            </p>
        </div>
        <div class="flex gap-3">
            <Button variant="outline">
                <Icon name="tabler:file-pencil" />
            </Button>
            <Button @click="deleteChapter">
                <Icon name="lucide:trash" />
            </Button>
        </div>
    </div>
</template>

<script setup>

const props = defineProps({
    chapter: {
        type: Object,
    }
})


const deleteChapter = async () => {
    try {
        await $fetch(`/api/admin/subjects/chapter/${props.chapter.id}`, {
            method: 'delete'
        })
        refreshNuxtData('subjects')
    } catch (error) {
        console.log(error)
    }
}


</script>

<style lang="scss" scoped></style>