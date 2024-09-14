// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: {
    enabled: true,
    timeline: {
      enabled: true,
    },
  },
  modules: [
    "@nuxtjs/tailwindcss",
    "shadcn-nuxt",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxt/image",
    "nuxt-vue3-google-signin",
  ],
  vite: {
    optimizeDeps: {
      exclude: ["vee-validate"],
    },
  },
  colorMode: {
    classSuffix: "",
  },
  runtimeConfig: {
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    public: {
      cloudinaryCloudName: process.env.NUXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      uploadPreset: process.env.NUXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
      recaptchaSiteKey: process.env.NUXT_PUBLIC_CAPTCHA_SITE_KEY,
      googleClientId: process.env.GOOGLE_CLIENT_ID,
    },
  },
  googleSignIn: {
    clientId: process.env.GOOGLE_CLIENT_ID,
  },
  imports: {
    dirs: ["./lib"],
  },
  css: ["~/assets/css/tailwind.css", "vue-plyr/dist/vue-plyr.css"],
  app: {
    head: {
      title: "বাংলা ব্যঞ্জন ২৫-২৬ ব্যাচ",
      meta: [
        {
          name: "og:title",
          content: "বাংলা ব্যঞ্জন ২৫-২৬ ব্যাচ",
        },
        {
          name: "og:description",
          content:
            "বাংলা ১ম পত্র ও ২য় পত্র ফুল সিলেবাস সম্পূর্ণ করে, আশা করছি কলেজ,বোর্ড এক্সাম এবং এডমিশনে সাফল্য নিশ্চিতের ভিত্তি গড়ে তুলবে এই ব্যাচ।",
        },

        {
          name: "og:image",
          content:
            "https://pub-de86fc8fea3047248c160c647017965e.r2.dev/cover/Bangla-Benjon-25-and-26_151_1725693603058",
        },
      ],
    },
  },
});
