<template>
    <div>

        <Button @click="isOpen = true">
            <Icon name="bx:bx-plus" />
            Import Questions
        </Button>

        <AppModal :isOpen="isOpen" size="sm:min-w-3xl" title="Import Questions" @onClose="onClose">
            <div class="flex gap-2">
                <Input type="text" v-model="url" placeholder="Enter the URL of the questions" />
                <Button>
                    <Icon name="bx:bx-plus" />
                    Fetch Questions
                </Button>
            </div>
            <div>
                <h1>Questions</h1>
                <pre>
                    {{ questions }}
                </pre>
            </div>
        </AppModal>

    </div>
</template>

<script setup>
const isOpen = ref(false)

const onClose = () => {
    isOpen.value = false
}

const url = ref('')
const questions = ref([])


const fetchQuestions = async () => {
    // const baseURL = `https://script.google.com/macros/s/AKfycbwzA-t_cUmiQpA7ArN8OEl_LBeu-JM9VgjrX3x0Camq-lsSt2Gd0xPZ3flPFyBipAQkJw/exec?type=question&sheet=${url.value}`





}



</script>

<style lang="scss" scoped></style>