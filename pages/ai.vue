<template>
    <AppContainer>



        <div class="space-y-6">
            <div class="space-y-4">
                <h1>Prompt for AI Response</h1>

                <Textarea v-model="prompt" placeholder="Enter your prompt here" />

                <Button @click="handlePrompt">

                    <span v-if="loading">Loading...</span>
                    <span v-else>Generate Response</span>

                </Button>

            </div>


            <div>
                <h2>Response</h2>
                <AppMath v-model="response" />
            </div>
        </div>


    </AppContainer>
</template>

<script setup>



const prompt = ref('')
const response = ref('')
const loading = ref(false)
const handlePrompt = async () => {
    loading.value = true
    if (prompt.value) {
        response.value = await aiGeneratedResponseGemini(prompt.value)
    }

    loading.value = false

}



</script>

<style lang="scss" scoped></style>