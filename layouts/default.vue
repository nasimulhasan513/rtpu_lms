<template>
  <div>
    <Navbar />
    <div class="bg-secondary" :class="{
      'pt-14 min-h-[calc(100vh-100px)]': !isHomePage
    }">
      <slot />
    </div>
  </div>
  <AppFooter />
  <AuthLogin />
</template>

<script lang="ts" setup>
const route = useRoute()
const isHomePage = computed(() => route.path === '/')
</script>

<style></style>