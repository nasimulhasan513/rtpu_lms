<template>
  <div
    class="py-16 bg-gradient-to-r from-primary to-primary-foreground md:min-h-[calc(100vh-100px)]"
  >
    <AppContainer>
      <div
        class="grid items-center grid-cols-1 gap-8 lg:pt0 pt-12 lg:grid-cols-2"
      >
        <div class="text-white">
          <h1 class="mb-4 text-4xl font-bold md:text-5xl">
            সাফল্যের নিশ্চয়তায় আমরা আছি তোমার পাশে
          </h1>
          <p class="mb-6 text-lg">
            আমাদের অনলাইন শিক্ষা প্ল্যাটফর্মে যোগ দিন এবং আপনার কেরিয়ার
            উন্নয়নের জন্য প্রয়োজনীয় দক্ষতা অর্জন করুন।
          </p>
          <div class="flex space-x-4">
            <Button
              size="lg"
              class="flex items-center gap-2 text-white bg-transparent border border-white rounded-full"
            >
              আজই যুক্ত হও
              <Icon name="heroicons:arrow-right" class="w-4 h-4" />
            </Button>
          </div>
        </div>
        <div class="relative">
          <div
            class="relative flex items-center justify-center h-full md:pt-16"
          >
            <img
              src="../../assets/image/hero.png"
              alt="Hero Image"
              class="object-cover h-full w-86"
            />
            <div
              class="absolute w-56 p-4 border rounded-lg shadow-md top-10 right-4 bg-white/10 backdrop-blur-sm border-white/30"
            >
              <p class="font-semibold text-primary">
                {{ banners[currentBanner].title }}
              </p>
              <p class="text-sm text-white/80">
                {{ banners[currentBanner].subtitle }}
              </p>
            </div>

            <div
              class="absolute flex space-x-2 transform -translate-x-1/2 bottom-4 left-1/2"
            >
              <span class="w-2.5 h-2.5 bg-white rounded-full"></span>
              <span class="w-2.5 h-2.5 bg-white/50 rounded-full"></span>
              <span class="w-2.5 h-2.5 bg-white/50 rounded-full"></span>
            </div>
          </div>
        </div>
      </div>
    </AppContainer>
  </div>
</template>

<script setup>
const banners = [
  {
    title: "১০০০০+ শিক্ষার্থী",
    subtitle: "আমাদের সাথে যুক্ত রয়েছে",
  },
  {
    title: "২০০+ চান্স পেয়েছে",
    subtitle: "বিভিন্ন পাবলিক বিশ্ববিদ্যালয়ে",
  },
  {
    title: "১০+ কোর্স রয়েছে",
    subtitle: "ভর্তি প্রস্তুতির জন্য",
  },
];

const currentBanner = ref(0);

const nextBanner = () => {
  currentBanner.value = (currentBanner.value + 1) % banners.length;
};

onMounted(() => {
  setInterval(nextBanner, 3000);
});
</script>

<style lang="scss" scoped>
.animated-3d-button {
  @apply shadow-md hover:shadow-lg transition-all duration-300;
}
</style>
