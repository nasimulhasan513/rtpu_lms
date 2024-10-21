<template>
  <AppContainer>
    <div class="container px-4 py-8 mx-auto">
      <div class="grid grid-cols-1 gap-8 md:grid-cols-3">
        <!-- Book Cover -->
        <div class="md:col-span-1">
          <img :src="book.cover" :alt="book.name" class="w-full rounded-lg shadow-lg" />
        </div>

        <!-- Book Details -->
        <div class="md:col-span-2">
          <h1 class="mb-4 text-3xl font-bold">{{ book.name }}</h1>

          <div class="flex items-center mb-4">
            <span class="mr-4 text-2xl font-semibold text-primary">৳{{ book.sale_price }}</span>
            <span v-if="book.regular_price > book.sale_price" class="text-lg line-through text-muted-foreground">৳{{
              book.regular_price }}</span>
          </div>

          <p class="mb-4 text-lg">{{ book.short_description }}</p>

          <div class="mb-4">
            <h2 class="mb-2 text-xl font-semibold">Authors:</h2>
            <div class="flex flex-wrap gap-4">
              <div v-for="author in book.authors" :key="author.id" class="flex items-center">
                <img :src="author.image" :alt="author.name" class="w-10 h-10 mr-2 rounded-full" />
                <div>
                  <p class="font-medium">{{ author.name }}</p>
                  <p class="text-sm text-muted-foreground">
                    {{ author.shortDesignation }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="mb-4">
            <h2 class="mb-2 text-xl font-semibold">Description:</h2>
            <ul class="list-disc list-inside">
              <li v-for="(desc, index) in book.description" :key="index" class="mb-2">
                {{ desc }}
              </li>
            </ul>
          </div>

          <div class="flex items-center gap-4 mb-4">
            <Button @click="addToCart">Add to Cart</Button>
            <Button variant="outline">Add to Wishlist</Button>
          </div>

          <div class="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span class="font-semibold">Category:</span> {{ book.category }}
            </div>
            <div>
              <span class="font-semibold">Pages:</span> {{ book.pages }}
            </div>
            <div>
              <span class="font-semibold">Weight:</span> {{ book.weight }}g
            </div>
            <div>
              <span class="font-semibold">Stock:</span>
              {{ book.remaining_stock }}
            </div>
          </div>
        </div>
      </div>

      <!-- Preview Images -->
      <div class="mt-12">
        <h2 class="mb-4 text-2xl font-semibold">Preview Pages</h2>
        <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
          <img v-for="(preview, index) in book.preview" :key="index" :src="preview" :alt="`Preview page ${index + 1}`"
            class="w-full transition-opacity rounded-lg shadow cursor-pointer hover:opacity-80"
            @click="openPreview(index)" />
        </div>
      </div>
    </div>
  </AppContainer>
</template>

<script setup>
import { ref } from "vue";
import { useToast } from "@/components/ui/toast";

const route = useRoute();
const { toast } = useToast();

// Fetch book data based on the slug
const book = {
  id: "66c8c22f9b291f39575bba01",
  name: "রসায়ন ১ম পত্র",
  cover:
    "https://storage.rhombuspublications.com/cover/WhatsApp Image 2024-09-20 at 11_560_1726810986493",
  preview: [
    "https://storage.rhombuspublications.com/pages/enc1/Engg_399_1726846944401",
    "https://storage.rhombuspublications.com/pages/enc1/Engg_384_1726846946755",
    "https://storage.rhombuspublications.com/pages/enc1/Engg_713_1726846948183",
    "https://storage.rhombuspublications.com/pages/enc1/Engg_215_1726846949412",
    "https://storage.rhombuspublications.com/pages/enc1/Engg_821_1726846951371",
    "https://storage.rhombuspublications.com/pages/enc1/Engg_95_1726846952588",
    "https://storage.rhombuspublications.com/pages/enc1/Engg_316_1726846955146",
    "https://storage.rhombuspublications.com/pages/enc1/Engg_176_1726846956139",
    "https://storage.rhombuspublications.com/pages/enc1/Engg_826_1726846957883",
    "https://storage.rhombuspublications.com/pages/enc1/Engg_348_1726846959366",
  ],
  category: "engineering",
  authors: [
    {
      id: "66c8bc8e9b291f39575bb9fc",
      name: "মোঃ নাজমুস সাকিব",
      image:
        "https://storage.rhombuspublications.com/authors/fbb3xtocc6gosgesmf9m.png",
      shortDesignation: "Chemistry Department, DU'17",
    },
    {
      id: "66c8bcb29c9584fdaceb7634",
      name: "সঞ্জয় চক্রবর্তী",
      image:
        "https://storage.rhombuspublications.com/authors/lqmbxt0rvvnezuxyitqc.png",
      shortDesignation: "ME, BUET'10",
    },
    {
      id: "66c8bcc59c9584fdaceb7635",
      name: "হিমেল বড়ুয়া",
      image:
        "https://storage.rhombuspublications.com/authors/bnwskpon3qhjtkopfluo.png",
      shortDesignation: "EEE, BUET'17",
    },
  ],
  short_description: "ইঞ্জিনিয়ারিং প্রস্তুতির সেরা রসায়ন বই",
  description: [
    "BUET, CKRUET, IUT, MIST, BUTex এর ভর্তি পরীক্ষায় আসা বিগত বছরের MCQ ও Written প্রশ্নের টপিকভিত্তিক Analysis.",
    "টপিকভিত্তিক Practice Problem গুলো এমনভাবে বাছাই করা হয়েছে যেন তোমার ইঞ্জিনিয়ারিং ভর্তি প্রস্তুতি একদম পূর্ণাঙ্গ হয়।",
    "সকল MCQ এবং Written প্রশ্নের সহজ ব্যাখ্যাসহ সমাধান যেন শিক্ষার্থীরা সহজে আয়ত্ত করতে পারে।",
    "MCQ সমাধানের জন্য প্রয়োজনীয় সকল Shortcut Technique বইটিতে পর্যাপ্ত উদাহরণসহ দেওয়া আছে যেন স্বল্পতম সময়ে MCQ সমাধান করা যায়।",
  ],
  keywords: ["rhombus"],
  sale_price: 400,
  regular_price: 450,
  stock: 1265,
  sold: 1220,
  pages: 192,
  weight: 250,
  slug: "enc1",
  order: 3,
  charge: 11,
  status: "upcoming",
  reviewed: "no",
  avgRating: "4.3",
  totalReview: 3,
  remaining_stock: 45,
};

const addToCart = () => {
  // Implement add to cart logic here
  toast({
    title: "Added to Cart",
    description: `${book.value.name} has been added to your cart.`,
  });
};

const openPreview = (index) => {
  // Implement preview modal logic here
  console.log(`Opening preview for image ${index + 1}`);
};
</script>

<style lang="scss" scoped></style>
