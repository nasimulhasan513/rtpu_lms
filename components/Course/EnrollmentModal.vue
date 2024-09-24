<template>


    <div class="flex items-end gap-5 ">
        <div class="grid flex-1 gap-4">
            <div class="space-y-2">
                <Label for="email">Email</Label>
                <Input id="email" type="email" placeholder="User email" v-model="email" :disabled="step !== 1" />
            </div>
            <div v-if="step >= 2" class="space-y-2">
                <Label for="uniqueId">Access Code</Label>
                <Input id="uniqueId" placeholder="Group Joining ID" v-model="uniqueId" :disabled="step !== 2" />
            </div>
        </div>

        <Button v-if="step === 1" @click="checkUser" :disabled="isLoading">
            {{ isLoading ? 'Searching...' : 'Search User' }}
        </Button>

        <Button v-if="step === 2" @click="enrollCourse" :disabled="isLoading">
            {{ isLoading ? 'Enrolling...' : 'Enroll' }}
        </Button>
    </div>


</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

const route = useRoute()
const isOpen = ref(false)
const { toast } = useToast()
const email = ref('')
const uniqueId = ref('')
const isLoading = ref(false)
const step = ref(1)
const user = ref(null)

const openModal = () => {
    isOpen.value = true
    step.value = 1
}

const closeModal = () => {
    isOpen.value = false
    email.value = ''
    uniqueId.value = ''
    user.value = null
    step.value = 1
}

const checkUser = async () => {
    if (!email.value) {
        toast({
            title: 'Error',
            description: 'Please enter an email address',
            variant: 'destructive',
        })
        return
    }

    isLoading.value = true
    try {
        const response = await $fetch('/api/auth/exists', {
            method: 'POST',
            body: { email: email.value },
        })
        user.value = response.user
        if (user.value) {
            step.value = 2
        } else {
            toast({
                title: 'User not found',
                description: 'No user found with this email address',
                variant: 'destructive',
            })
        }
    } catch (error) {
        toast({
            title: 'Error',
            description: error.message || 'Failed to check user',
            variant: 'destructive',
        })
    } finally {
        isLoading.value = false
    }
}

const enrollCourse = async () => {
    isLoading.value = true
    try {
        const response = await $fetch('/api/enrollment/manual', {
            method: 'POST',
            body: {
                courseId: route.params.id,
                uniqueId: uniqueId.value,
                userId: user.value.id,
            },
        })
        toast({
            title: 'Success',
            description: 'User has been enrolled in the course',
        })
        closeModal()
    } catch (error) {
        toast({
            title: 'Error',
            description: error.message || 'Failed to enroll in the course',
            variant: 'destructive',
        })
    } finally {
        isLoading.value = false
    }
}
</script>