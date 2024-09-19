<template>
  <AppContainer>
    <div class="flex flex-col items-center justify-center min-h-screen text-center">
      <Icon name="lucide:hard-hat" class="w-24 h-24 mb-6 text-yellow-500" />
      <h1 class="mb-4 text-4xl font-bold text-gray-800 dark:text-gray-200">
        নির্মাণাধীন
      </h1>
      <p class="mb-8 text-xl text-gray-600 dark:text-gray-400">
        এই পৃষ্ঠাটি বর্তমানে তৈরি করা হচ্ছে। অনুগ্রহ করে পরে আবার চেষ্টা করুন।
      </p>
      
    </div>
  </AppContainer>
</template>

<script setup>
definePageMeta({
  layout: 'course'
})

const route = useRoute()
</script>

<style lang="scss" scoped>

</style>