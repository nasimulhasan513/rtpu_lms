<template>
    <AppModal :isOpen="isOpen" title="স্বাগতম!" description="আপনার অ্যাকাউন্টে লগইন করুন" :centerTitle="true"
        @onClose="onClose" v-if="isOpen">

        <div class="space-y-6" ref="modalRef">
            <div class="flex flex-col gap-3" v-if="step == 'init' && isGoogleLoginSupported">
                <AuthGoogleButton @loggedin="onClose" :width="googleButtonWidth" />
            </div>
            <p class="text-sm text-center text-red-500" v-if="!isGoogleLoginSupported">
                [বি:দ্র: ওয়েবএ্যাপের লিংকটি ক্রোম ব্রাউজারে ওপেন করবে। সরাসরি ফেসবুক অথবা মেসেঞ্জার থেকে লগইন করা যাবে
                না।]
            </p>

            <div class="hidden space-y-6">
                <FormField v-slot="{ componentField }" name="cred">
                    <FormItem>
                        <FormLabel>
                            {{ credType ? '' : 'ইমেইল অথবা ফোন নম্বর' }}
                            <span v-if="credType">
                                {{ credType == 'email' ? 'ইমেইল এড্রেস' : 'ফোন নম্বর' }}
                            </span>
                        </FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="ইমেইল অথবা ফোন নম্বর" v-bind="componentField" v-model="cred"
                                :disabled="step == 'signup'" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-if="step === 'signup'" v-slot="{ componentField }" name="name">
                    <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="আপনার নাম লিখুন" v-model="name" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-if="step === 'signup'" v-slot="{ componentField }" name="cred2">
                    <FormItem>
                        <FormLabel>{{ credType == 'email' ? 'ফোন নম্বর' : 'ইমেইল ঠিকানা' }}</FormLabel>
                        <FormControl>
                            <Input type="text" :placeholder="credType == 'email' ? 'ফোন নম্বর' : 'ইমেইল এড্রেস'"
                                v-bind="componentField" v-model="cred2" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-if="step === 'signup'" v-slot="{ componentField }" name="hsc_batch">
                    <FormItem>
                        <FormLabel>
                            এইচএসসি ব্যাচ
                        </FormLabel>

                        <Select v-bind="componentField" v-model="hsc_batch">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="ব্যাচ নির্বাচন করুন" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup v-for="b in hsc_batches" :key="b">
                                    <SelectItem :value="b">
                                        {{ b }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <FormMessage />
                    </FormItem>
                </FormField>



                <FormField v-if="step === 'login' || step === 'signup'" v-slot="{ componentField }" name="password">
                    <FormItem>
                        <FormLabel> {{ step == 'login' ? '' : 'নতুন অ্যাকাউন্টের ' }} পাসওয়ার্ড</FormLabel>
                        <FormControl>
                            <div class="relative">
                                <Input :type="showPass ? 'text' : 'password'" placeholder="********"
                                    v-bind="componentField" v-model="password" @keypress.enter="onSubmit" />
                                <Icon :name="showPass ? 'heroicons:eye' : 'heroicons:eye-slash'"
                                    class="absolute w-4 h-4 right-4 top-3" @click="showPass = !showPass" />
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>

                <FormField v-if="step === 'otp'" v-slot="{ componentField }" name="otp">
                    <FormItem>
                        <div class="flex items-center justify-between">
                            <FormLabel>ওটিপি কোড</FormLabel>
                            <Button v-if="!timer" size="xs" variant="outline" @click="sendVerificationCode">
                                পুনরায় পাঠান
                            </Button>
                            <span v-else class="text-sm text-gray-600"> {{ timer }}</span>
                        </div>
                        <FormControl>
                            <Input type="tel" placeholder="ওটিপি কোড" v-bind="componentField" v-model="otp" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>


            </div>

            <div class="flex flex-col hidden gap-2">
                <div class="flex flex-row items-center w-full gap-4">


                    <AppButton :label="buttonLabels[step]" :loadingLabel="buttonLoadingLabels[step]"
                        :loading="isLoading" class="w-full" @click="onSubmit" />

                </div>
                <div class="flex flex-col gap-4 mt-3 " v-if="step === 'login'">
                    <hr />
                    <div class="mt-4 font-light text-center">
                        <p class="font-semibold cursor-pointer hover:text-gray-700" @click.prevent="forgetPassword">
                            পাসওয়ার্ড ভুলে গেছেন?
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </AppModal>
</template>

<script setup>
import { useToast } from '@/components/ui/toast/use-toast'

const { isOpen, onClose, slug } = useLogin()

const forgetPassword = () => {
    onClose()
    navigateTo('/auth/forget')
}

const isLoading = ref(false)
const showPass = ref(false)
const { toast } = useToast()
const user = useUser();
const step = ref('init')

const name = ref('')
const hsc_batch = ref('')
const cred = ref('')
const cred2 = ref('')
const otp = ref('')
const password = ref('')
const { executeRecaptcha } = useGoogleRecaptcha()

const onSubmit = async () => {
    switch (step.value) {
        case 'init':
            sendVerificationCode();
            break;

        case 'login':
            // Perform login with password (code omitted for brevity)
            await handleLogin();
            break;

        case 'otp':
            // Verify OTP (code omitted for brevity)
            const otpVerified = await verifyOTP();
            if (otpVerified) {
                step.value = 'signup'; // Proceed to registration if OTP is verified
            } else {
                toast({
                    title: "ব্যর্থ ওটিপি",
                    description: "অনুগ্রহপূর্বক পুনরায় চেষ্টা করুন",
                    variant: 'destructive'
                })
            }
            break;

        case 'signup':
            // Handle registration (code omitted for brevity)
            await handleRegistration();
            break;
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


const sendVerificationCode = async () => {
    isLoading.value = true
    const { token } = await executeRecaptcha('submit')
    const data = await useRequestFetch()("/api/auth/exists", {
        method: "POST",
        body: {
            cred: cred.value,
            token
        }
    });
    isLoading.value = false
    if (data) {
        step.value = 'login' // Proceed to password input if user exists
    } else {

        toast({
            title: "ওটিপি পাঠানো হয়েছে",
            description: "অনুগ্রহপূর্বক আপনার ইমেইল বা ফোনে চেক করুন",
        })

        runTimer(5)
        step.value = 'otp' // Proceed to OTP input if user doesn't exist
    }
}

const handleLogin = async () => {

    try {
        isLoading.value = true
        const data = await useRequestFetch()("/api/auth/signin", {
            method: "POST",
            body: {
                cred: cred.value,
                password: password.value
            }
        });
        if (data) {
            await assignUser();
            return onClose()
        }
    } catch (e) {
        toast({
            title: "লগইন ব্যর্থ",
            description: "অনুগ্রহপূর্বক পুনরায় চেষ্টা করুন",
        })
    } finally {
        isLoading.value = false
    }

}

const verifyOTP = async () => {
    try {

        isLoading.value = true

        let data = await $fetch('/api/auth/verify', {
            method: 'POST',
            body: {
                cred: cred.value,
                otp: otp.value
            }
        })
        return data
    } catch (e) {
        toast({
            title: "ওটিপি যাচাই ব্যর্থ",
            description: "অনুগ্রহপূর্বক পুনরায় চেষ্টা করুন",
            variant: 'destructive'
        })
        return false
    } finally {
        isLoading.value = false
    }

}

const handleRegistration = async () => {
    try {
        const data = await useRequestFetch()("/api/auth/signup", {
            method: "POST",
            body: {
                name: name.value,
                cred: cred.value,
                cred2: cred2.value,
                hsc_batch: hsc_batch.value,
                password: password.value,
            }
        });

        if (data) {
            await assignUser();


            // reset form
            cred.value = ''
            cred2.value = ''
            name.value = ''
            hsc_batch.value = ''
            password.value = ''
            step.value = 'init'


            return onClose()
        }
    } catch (e) {
        toast({
            title: "রেজিস্ট্রেশন ব্যর্থ",
            description: "অনুগ্রহপূর্বক পুনরায় চেষ্টা করুন",
        })
    }
}

const assignUser = async () => {
    const data = await useRequestFetch()("/api/user");
    if (data) {
        user.value = data;
    }

    onClose()
}

watch(cred, () => {
    if (cred.value && step.value !== 'init') {
        step.value = 'init';
    }
})


const buttonLabels = {
    init: 'লগইন',
    login: 'লগইন',
    signup: 'সাইন আপ',
    otp: 'যাচাই '
}

const buttonLoadingLabels = {
    init: 'যাচাই করা হচ্ছে...',
    login: 'লগইন করা হচ্ছে...',
    signup: 'সাইন আপ করা হচ্ছে...',
    otp: 'যাচাই করা হচ্ছে...'
}

const hsc_batches = [
    'HSC 2024',
    'HSC 2025',
    'HSC 2026',
    'Others'
]

const credType = ref('')

watch(cred, () => {
    if (cred.value && cred.value.match(/^\d{11}$/)) {
        credType.value = 'phone'
    } else if (cred.value && cred.value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/)) {
        credType.value = 'email'
    }
})

const isGoogleLoginSupported = computed(() => {
    if (import.meta.client) {
        const userAgent = navigator.userAgent.toLowerCase();
        return !userAgent.includes('fban') && !userAgent.includes('fbav');
    }
    return false
})

const modalRef = ref(null)
const googleButtonWidth = computed(() => {
    if (modalRef.value) {
        // Subtract padding if necessary
        return `${modalRef.value.offsetWidth}px`
    }
    return '360px' // Default width
})

</script>
