<template>
    <div class="space-y-6">
        <PinInput id="pin-input" v-model="value" placeholder="○" @complete="handleComplete">
            <PinInputGroup>
                <PinInputInput v-for="(id, index) in 6" :key="id" :index="index" />
            </PinInputGroup>
        </PinInput>

        <div>
            <span class="text-sm text-gray-600"> {{ timer }}</span>
        </div>
        <div v-if="isLoading">
            Please wait...
        </div>
    </div>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'
const { toast } = useToast()
const value = ref([''])
const isLoading = ref(false)


const emits = defineEmits(['verified', 'resend'])

const handleComplete = async (e) => {
    let otp = e.join('')
    isLoading.value = true

    try {
        const token = localStorage.getItem('resetToken')
        let data = await $fetch('/api/auth/otp', {
            method: 'POST',
            body: { otp, token }
        })

        if (data && data.verified) {

            localStorage.setItem('_o', otp)

            emits('verified')
        }


    } catch (error) {
        toast({
            title: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false


    }
}



const timer = ref(null)
const runTimer = (minute) => {
    let time = minute * 60
    let minutes = Math.floor(time / 60)
    let seconds = time % 60
    timer.value = `${minutes}:${seconds}`
    let interval = setInterval(() => {
        time--
        minutes = Math.floor(time / 60)
        seconds = time % 60

        if (seconds < 10) {
            seconds = `0${seconds}`
        }

        if (minutes < 10) {
            minutes = `0${minutes}`
        }

        timer.value = `${minutes}:${seconds}`
        if (time <= 0) {
            timer.value = null
            clearInterval(interval)
        }
    }, 1000)
}

onMounted(() => {
    runTimer(5)
})

</script>

<style lang="scss" scoped></style>