<template>
  <AppContainer>
    <div class="container mx-auto py-8">
      <h1 class="text-3xl font-bold mb-8">বই সমূহ</h1>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <div
          v-for="book in books"
          :key="book.id"
          class="bg-white rounded-lg shadow-md overflow-hidden"
        >
          <img
            :src="book.coverImage"
            :alt="book.title"
            class="w-full h-48 object-cover"
          />
          <div class="p-4">
            <h2 class="text-lg font-semi mb-2 truncate">
              {{ book.title }}
            </h2>
            <p class="text-sm text-gray-600 mb-2">{{ book.author }}</p>
            <div class="flex justify-between items-center">
              <div class="flex flex-row gap-2 items-center">
                <span class="text-primary-600 font-bold">Tk. 4214</span>
                <span class="text-red-600 font-bold line-through"
                  >Tk. 1241</span
                >
              </div>
              <Button
                size="sm"
                class="text-white font-normal"
                @click="navigateTo(`/books/${book.id}`)"
                >বিস্তারিত</Button
              >
            </div>
          </div>
        </div>
      </div>
    </div>
  </AppContainer>
</template>

<script setup>
import { navigateTo } from "nuxt/app";

const books = [
  {
    id: 1,
    title: "পদার্থবিজ্��ানের মৌলিক ধারণা",
    author: "ড. মোহাম্মদ আলী",
    price: 350,
    coverImage: "https://placehold.co/400x300?text=Physics+Book",
  },
  {
    id: 2,
    title: "বাংলা সাহিত্যের ইতিহাস",
    author: "রবীন্দ্রনাথ ঠাকুর",
    price: 280,
    coverImage: "https://placehold.co/400x300?text=Physics+Book",
  },
  {
    id: 3,
    title: "গণিতের মজার জগৎ",
    author: "ড. মুনির হাসান",
    price: 220,
    coverImage: "https://placehold.co/400x300?text=Physics+Book",
  },
  {
    id: 4,
    title: "বাংলাদেশের স্বাধীনতা যুদ্ধ",
    author: "প্রফেসর সিরাজুল ইসলাম",
    price: 400,
    coverImage: "https://placehold.co/400x300?text=Physics+Book",
  },
  {
    id: 5,
    title: "প্রোগ্রামিং শেখার সহজ উপায়",
    author: "তামিম শাহরিয়ার সুবিন",
    price: 320,
    coverImage: "https://placehold.co/400x300?text=Physics+Book",
  },
  {
    id: 6,
    title: "জীববিজ্ঞানের অদ্ভুত জগৎ",
    author: "ড. জাফর ইকবাল",
    price: 280,
    coverImage: "https://placehold.co/400x300?text=Physics+Book",
  },
  {
    id: 7,
    title: "বাংলাদেশের ভূগোল",
    author: "ড. মাহফুজা খানম",
    price: 250,
    coverImage: "https://placehold.co/400x300?text=Physics+Book",
  },
  {
    id: 8,
    title: "ইংরেজি ভাষা শেখার কৌশল",
    author: "মুনজেরিন শহীদ",
    price: 180,
    coverImage: "https://placehold.co/400x300?text=Physics+Book",
  },
];
</script>

<style lang="scss" scoped></style>
