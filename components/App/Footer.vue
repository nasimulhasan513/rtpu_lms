<template>
    <footer class="text-gray-600 bg-gray-100 dark:bg-gray-900 dark:text-gray-300">
        <AppContainer class="py-10">

            <div class="border-gray-200 dark:border-gray-700">
                <div class="flex flex-col items-center justify-between md:flex-row">
                    <p>&copy; ২০২৪ সর্বস্বত্ব সংরক্ষিত।</p>
                    <div class="flex mt-4 space-x-4 md:mt-0">
                        <NuxtLink v-for="link in legalLinks" :key="link.to" :to="link.to"
                            class="transition-colors hover:text-primary">
                            {{ link.label }}
                        </NuxtLink>
                    </div>
                </div>
            </div>
        </AppContainer>
    </footer>
</template>

<script setup>
const legalLinks = [
    { label: "প্রাইভেসি পলিসি", to: "/privacy-policy" },
    { label: "শর্তাবলী", to: "/terms-of-service" },
    { label: "কুকি পলিসি", to: "/cookie-policy" },
];


</script>