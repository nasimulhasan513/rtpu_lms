<template>
    <Dialog :open="isOpen" @close="closeModal">
        <DialogContent class="sm:max-w-[425px]">
            <DialogHeader>
                <DialogTitle>Enroll in Course</DialogTitle>
                <DialogDescription>
                    You can find the group joining ID from ASG SHOP invoice.
                </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4">
                <div class="space-y-2">
                    <Label for="uniqueId">
                        Access Code
                    </Label>
                    <Input id="uniqueId" placeholder="Group Joining ID" v-model="uniqueId" class="col-span-3" />
                </div>
            </div>
            <DialogFooter>
                <Button @click="closeModal">Cancel</Button>
                <Button @click="enrollCourse" :disabled="isEnrolling">
                    {{ isEnrolling ? 'Enrolling...' : 'Enroll' }}
                </Button>
            </DialogFooter>
        </DialogContent>
    </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useToast } from '@/components/ui/toast/use-toast'

const props = defineProps<{
    isOpen: boolean
    courseId: string
}>()

const emit = defineEmits<{
    (e: 'close'): void
    (e: 'enrolled'): void
}>()

const { toast } = useToast()
const uniqueId = ref('')
const isEnrolling = ref(false)

const closeModal = () => {
    emit('close')
    uniqueId.value = ''
}

const enrollCourse = async () => {
    if (!uniqueId.value) {
        toast({
            title: 'Error',
            description: 'Please enter a unique ID',
            variant: 'destructive',
        })
        return
    }

    isEnrolling.value = true

    try {
        const response = await $fetch('/api/enrollment', {
            method: 'POST',
            body: {
                courseId: props.courseId,
                uniqueId: uniqueId.value,
            },
        })

        toast({
            title: 'Success',
            description: 'You have been enrolled in the course',
        })
        emit('enrolled')
        closeModal()
    } catch (error: any) {
        toast({
            title: 'Error',
            description: error.message || 'Failed to enroll in the course',
            variant: 'destructive',
        })
    } finally {
        isEnrolling.value = false
    }
}
</script>