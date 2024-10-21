<template>
    <GoogleSignInButton v-if="!user" @success="handleGoogleLoginSuccess" @error="handleGoogleLoginError"
        :disabled="isLoadingGoogle" :width="width">
    </GoogleSignInButton>

</template>

<script setup>

const props = defineProps({
    width: {
        type: String,
        default: '360px'
    }
})

const emits = defineEmits(['loggedin'])

const isLoadingGoogle = ref(false)
const user = useUser()
const assignUser = async () => {
    const data = await useRequestFetch()("/api/user");
    if (data) {
        user.value = data;
    }

    emits('loggedin')
}


const handleGoogleLoginSuccess = async (response) => {
    try {
        isLoadingGoogle.value = true
        await $fetch("/api/auth/google", {
            method: "POST",
            body: {
                accessToken: response.credential,
            },
        });

        await assignUser()

    } catch (error) {
        console.log(error)
    } finally {
        isLoadingGoogle.value = false
    }

}

const handleGoogleLoginError = (error) => {
    toast({
        title: "Google login failed",
        description: "Please try again",
        variant: 'destructive'
    })
}




</script>

<style lang="scss" scoped></style>