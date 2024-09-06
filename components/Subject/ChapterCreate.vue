<template>
    <div class="flex items-end gap-2 p-4 sm:p-6">
        <div class="flex-1">
            <Input v-model="chapterName" placeholder="Chapter Name" @keyup.enter="createChapter" />
        </div>
        <Button variant="outline" @click="createChapter">
            <Icon name="lucide:plus" class="mr-2" />
            Add Chapter
        </Button>
    </div>

</template>

<script setup>

const { subject } = defineProps(['subject'])


const chapterName = ref('')
const createChapter = async () => {
    if (chapterName.value === '') {
        return
    }

    await $fetch('/api/admin/subjects/chapter', {
        method: 'post',
        body: {
            subjectId: subject,
            name: chapterName.value
        }
    })

    refreshNuxtData('subjects')
}


</script>

<style lang="scss" scoped></style>