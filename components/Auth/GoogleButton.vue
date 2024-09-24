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

const route = useRoute()

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

        if (route.name == "shop-slug") {
            const enrollment = await isEnrolled(route.params.slug);
            if (enrollment) {
                const category = await $fetch(`/api/category/${route.params.shop}`);
                if (category?.is_class) {
                    return navigateTo(`/${route.params.shop}/${route.params.slug}/lessons`);
                } else {
                    return navigateTo(`/${route.params.shop}/${route.params.slug}/mcq`);
                }
            }
        }


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