<template>
    <div class="flex justify-between">
        <AppHeading title="Our Pride Teachers" />
        <Button @click="onOpen">
            <Icon name="lucide:plus" />
            Add Teacher
        </Button>
    </div>





    <div class="py-6">
        <div class="grid gap-6 md:grid-cols-2">

            <Card v-for="a in data" :key="a.id" class="flex ">
                <TeacherCard class="border-none shadow-none" :name="a.name" :image="a.image"
                    :biography="a.designation" />
                <div class="flex items-center gap-3 pr-3">
                    <Button variant="outline" @click="onEdit(a)">
                        <Icon name="akar-icons:pencil" />

                    </Button>
                    <Button variant="destructive" @click="deleteTeacher(a.id)">
                        <Icon name="akar-icons:trash-can" />

                    </Button>
                </div>
            </Card>

        </div>


    </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

const { onOpen, onEdit } = useTeachermodal()

const { data, refresh, status } = await useFetch('/api/admin/teachers', {
    method: 'get',
    key: 'teachers',
    middleware: 'admin',
})


const { toast } = useToast()


const deleteTeacher = async (id) => {

    if (!confirm('Are you sure you want to delete this Teacher?')) return



    const res = await $fetch(`/api/admin/teachers/${id}`, {
        method: 'delete'
    })

    if (res.statusCode === 204) {
        toast({
            title: 'Teacher deleted',
            message: 'Teacher has been deleted successfully',
            variant: 'success'
        })

        refresh()
    }
}




</script>

<style lang="scss" scoped></style>