<template>
  <div class="min-h-[76vh] bg-background">
    <AppContainer>
      <h2 class="text-3xl font-bold mt-8 mb-4 text-center">আমাদের সম্পর্কে</h2>
      <p class="text-lg text-justify max-w-3xl mb-8">
        আরটিপিইউতে, আমাদের লক্ষ্য হলো শিক্ষার্থীদের পাবলিক বিশ্ববিদ্যালয়ে পড়ার
        স্বপ্ন পূরণে সহায়তা করা। আমরা বিশ্বাস করি যে প্রতিটি শিক্ষার্থী, তাদের
        পটভূমি নির্বিশেষে, মানসম্পন্ন শিক্ষা এবং তাদের পূর্ণ সম্ভাবনা অর্জনের
        সুযোগ পাওয়ার অধিকারী।
      </p>

      <h3 class="text-2xl font-semibold mb-4">আমাদের দৃষ্টিভঙ্গি</h3>
      <p class="text-lg text-justify max-w-3xl mb-8">
        বাংলাদেশের শীর্ষস্থানীয় এডটেক প্ল্যাটফর্ম হিসেবে প্রতিষ্ঠিত হওয়া, যা
        শিক্ষার্থীদের এইচএসসি পরীক্ষায় উত্কৃষ্টতা অর্জন এবং তাদের পছন্দের
        পাবলিক বিশ্ববিদ্যালয়ে ভর্তির জন্য সর্বোত্তম সম্ভাব্য সংস্থান এবং
        সহায়তা প্রদান করে।
      </p>

      <h3 class="text-2xl font-semibold mb-4">আমরা যা করি</h3>
      <ul class="list-disc list-inside text-lg mb-8">
        <li>বিস্তৃত এইচএসসি কোর্স</li>
        <li>ভর্তি প্রস্তুতি কোর্স</li>
        <li>ব্যক্তিগতকৃত শিক্ষা</li>
        <li>বিশেষজ্ঞ শিক্ষক</li>
        <li>উদ্ভাবনী প্রযুক্তি</li>
      </ul>

      <h3 class="text-2xl font-semibold mb-4">আমাদের মূল্যবোধ</h3>
      <ul class="list-disc list-inside text-lg mb-8">
        <li>শিক্ষার্থী-কেন্দ্রিক</li>
        <li>মানসম্পন্ন শিক্ষা</li>
        <li>উদ্ভাবন</li>
        <li>প্রবেশযোগ্যতা</li>
        <li>শ্রেষ্ঠত্ব</li>
      </ul>
    </AppContainer>
  </div>
</template>

<script setup>
const { status, shopStatus, shop, courses, fetchCourses, fetchShop } =
  useShop();
fetchShop();
fetchCourses();
</script>

<style lang="scss" scoped></style>
