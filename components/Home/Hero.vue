<template>
    <div class="py-16 bg-gradient-to-r from-primary to-primary-foreground md:max-h-screen">
        <AppContainer>
            <div class="grid items-center grid-cols-1 gap-8 md:grid-cols-2">
                <div class="text-white">
                    <h1 class="mb-4 text-4xl font-bold md:text-5xl">
                        সাফল্যের নিশ্চয়তায় আমরা আছি তোমার পাশে
                    </h1>
                    <p class="mb-6 text-lg">
                        আমাদের অনলাইন শিক্ষা প্ল্যাটফর্মে যোগ দিন এবং আপনার কেরিয়ার উন্নয়নের জন্য প্রয়োজনীয় দক্ষতা
                        অর্জন করুন।
                    </p>
                    <div class="flex space-x-4">
                        <Button size="lg"
                            class="flex items-center gap-2 text-white bg-transparent border border-white rounded-full">
                            আজই যুক্ত হও
                            <Icon name="heroicons:arrow-right" class="w-4 h-4" />
                        </Button>
                    </div>
                </div>
                <div class="relative">
                    <img src="../../assets/image/hero.png" alt="Hero Image" class="object-cover w-full h-full " />
                    <div
                        class="absolute p-4 border rounded-lg shadow-md top-10 right-4 bg-white/10 backdrop-blur-sm border-white/30">
                        <p class="font-semibold text-primary">১০০০০+ শিক্ষার্থী</p>
                        <p class="text-sm text-white/80">আমাদের সাথে যুক্ত রয়েছে</p>
                    </div>
                </div>
            </div>
        </AppContainer>
    </div>
</template>

<script setup>
</script>

<style lang="scss" scoped>
.animated-3d-button {
    @apply shadow-md hover:shadow-lg transition-all duration-300;
}
</style>
