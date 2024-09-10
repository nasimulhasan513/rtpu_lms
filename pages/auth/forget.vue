<template>
    <div class="max-w-md py-20 mx-auto">
        <AppHeading title="পাসওয়ার্ড ভুলে গেছেন" subtitle="ওটিপি ব্যবহার করে রিসেট করুন" />

        <div class="mt-5">
            <div v-if="step == 1">
                <AuthForget @sendCode="nextStep" />
            </div>
            <div v-if="step == 2">
                <AuthOtp @verified="nextStep" @reset="sendCode" />
            </div>
            <div v-if="step == 3">
                <AuthReset />
            </div>
        </div>
    </div>
</template>

<script setup>


definePageMeta({
    title: 'Forget Password',
    layout: 'blank'
})


const route = useRoute()
const router = useRouter()

const step = ref(parseInt(route.query.step) || 1)

const nextStep = () => {
    step.value = step.value + 1
    router.push({ query: { step: step.value } })
}

watch(route.query, () => {
    step.value = parseInt(route.query.step) || 1
})



</script>

<style lang="scss" scoped></style>