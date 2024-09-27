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
    "@nuxtjs/seo",
  ],
  vite: {
    optimizeDeps: {
      exclude: ["vee-validate"],
    },
  },
  colorMode: {
    classSuffix: "",
    preference: "light",
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
      title: "ACS Courses",
      meta: [
        {
          name: "og:title",
          content: "ACS Courses",
        },
        {
          name: "og:description",
          content: "ACS Courses",
        },
      ],
    },
  },
  site: {
    url: "https://courses.apars.tech",
    name: "ACS Courses",
    description: "ACS Courses",
    defaultLocale: "en",
  },
  sitemap: {
    exclude: ["/admin/**", "/api/**"],
  },
  icon: {
    mode: "svg",
    serverBundle: {
      collections: ["lucide"], // <!--- this
    },
  },
});
