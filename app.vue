<template>
  <div>
    <NuxtLoadingIndicator />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
    <Toaster />
  </div>
</template>

<script setup lang="ts">
import Toaster from '@/components/ui/toast/Toaster.vue'

const colorMode = useColorMode()

const color = computed(() => colorMode.value === 'dark' ? '#09090b' : '#ffffff')

useHead({
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { key: 'theme-color', name: 'theme-color', content: color },
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' },
  ],
  htmlAttrs: {
    lang: 'en',
  },
})



// const user = useUser()

// onMounted(() => {
//   if (user.value) {
//     let redirect = localStorage.getItem('redirect')
//     if (redirect) {
//       localStorage.removeItem('redirect')
//       navigateTo(redirect)
//     }
//   }
// })


</script>