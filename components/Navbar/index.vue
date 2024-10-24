<template>
  <div
    class="fixed z-10 w-full backdrop-blur-md"
    :class="{
      'bg-white': !isHomePage,
    }"
  >
    <div class="py-3">
      <AppContainer>
        <div class="flex items-center justify-between">
          <div class="flex items-center justify-between flex-1 space-x-4">
            <NavbarLogo />

            <nav class="hidden px-4 space-x-4 md:flex">
              <NuxtLink
                v-for="item in mainMenu"
                :key="item.path"
                :to="item.path"
                class="flex items-center px-4 py-2 transition-colors duration-300 rounded-md cursor-pointer outline outline-transparent"
                :class="{
                  'text-white hover:outline-primary hover:text-white':
                    isHomePage,
                  'text-slate-600 hover:text-slate-900 hover:bg-slate-100':
                    !isHomePage,
                  'bg-primary text-white': $route.path === item.path,
                }"
              >
                <Icon :name="item.icon" class="w-5 h-5 mr-2" />
                {{ item.name }}
              </NuxtLink>
            </nav>
          </div>
          <div class="flex items-center space-x-4">
            <NavbarUserMenu />
            <Button
              variant="ghost"
              size="icon"
              class="md:hidden"
              :class="{
                'text-white hover:outline-primary hover:text-white': isHomePage,
                'text-slate-600 hover:text-slate-900 hover:bg-slate-100':
                  !isHomePage,
              }"
              @click="toggleMobileMenu"
            >
              <Icon name="lucide:menu" class="w-6 h-6" />
            </Button>
          </div>
        </div>
      </AppContainer>
    </div>

    <!-- Mobile menu -->
    <Transition name="slide-fade">
      <div
        v-if="isMobileMenuOpen"
        class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden"
      >
        <div
          class="fixed inset-y-0 right-0 z-50 w-full h-full max-w-sm border-l shadow-lg bg-background"
        >
          <div class="flex flex-col bg-white h-screen">
            <div
              class="flex items-center bg-white justify-between p-4 border-b"
            >
              <h2 class="text-lg font-semibold">মেনু</h2>
              <Button variant="ghost" size="icon" @click="toggleMobileMenu">
                <Icon name="lucide:x" class="w-6 h-6" />
              </Button>
            </div>
            <nav class="flex flex-col bg-white p-4 space-y-4">
              <NuxtLink
                v-for="item in mainMenu"
                :key="item.path"
                :to="item.path"
                @click="toggleMobileMenu"
                class="flex items-center px-4 py-2 transition-colors duration-200 rounded-md hover:bg-primary hover:text-white"
                :class="{
                  'bg-primary text-white': $route.path === item.path,
                  'text-foreground hover:text-primary':
                    $route.path !== item.path,
                }"
              >
                <Icon :name="item.icon" class="w-5 h-5 mr-3" />
                <span class="font-medium">{{ item.name }}</span>
              </NuxtLink>
            </nav>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { mainMenu } from "@/constants/menus";

const isMobileMenuOpen = ref(false);

function toggleMobileMenu() {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
}

const route = useRoute();
const isHomePage = computed(() => route.path === "/");
</script>

<style scoped>
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
