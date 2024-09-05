<script setup lang="ts">
defineProps<{
  reverse?: boolean
}>()
</script>

<template>
  <div class="relative flex items-center justify-center px-4 h-dvh lg:max-w-none lg:px-0"
    :class="{ 'flex-row-reverse': reverse }">
    <div class="relative flex-col flex-1 hidden h-full pt-10 text-white ps-10 bg-muted lg:flex dark:border-r">
      <div class="absolute inset-0 bg-zinc-900" />
      <div class="relative z-20 flex flex-col items-center justify-center h-full text-lg font-medium">
        <h3>
          <span class="text-2xl font-semibold">ACADEMIA LMS</span>
        </h3>
        <p class="mt-10 text-2xl font-bold text-transparent bg-gradient-to-r from-blue-500 to-green-600 bg-clip-text ">
          The best platform to learn and teach
        </p>
      </div>
    </div>
    <div class="flex-1 mx-auto lg:p-8">
      <slot />
    </div>
  </div>
</template>

<style scoped></style>
