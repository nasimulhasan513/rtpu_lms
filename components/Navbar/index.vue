<template>
    <div class="fixed z-10 w-full bg-white shadow-sm">
        <div class="py-3 border-b-[1px]">
            <AppContainer>
                <div class="flex items-center justify-between">
                    <div class="flex items-center flex-1 space-x-4">
                        <NavbarLogo />
                        <!-- <nav class="justify-center flex-1 hidden space-x-2 md:flex">
                            <Button v-for="item in mainMenu" :key="item.path" variant="ghost" :to="item.path">
                                <Icon :name="item.icon" class="w-4 h-4 mr-2" />
                                {{ item.name }}
                            </Button>
                        </nav> -->
                    </div>
                    <div class="flex items-center space-x-4">
                        <NotificationDropdown />
                        <NavbarUserMenu />
                        <Button variant="ghost" size="icon" class="md:hidden" @click="toggleMobileMenu">
                            <Icon name="lucide:menu" class="w-6 h-6" />
                        </Button>
                    </div>
                </div>
            </AppContainer>
        </div>


        <!-- <Transition name="slide-fade">
            <div v-if="isMobileMenuOpen" class="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
                <div class="fixed inset-y-0 right-0 z-50 w-full max-w-sm border-l shadow-lg bg-background">
                    <div class="flex flex-col h-full">
                        <div class="flex items-center justify-between p-4 border-b">
                            <h2 class="text-lg font-semibold">Menu</h2>
                            <Button variant="ghost" size="icon" @click="toggleMobileMenu">
                                <Icon name="lucide:x" class="w-6 h-6" />
                            </Button>
                        </div>
                        <nav class="flex flex-col p-4 space-y-4">
                            <Button v-for="item in mainMenu" :key="item.path" variant="ghost" :to="item.path" @click="toggleMobileMenu">
                                <Icon :name="item.icon" class="w-4 h-4 mr-2" />
                                {{ item.name }}
                            </Button>
                        </nav>
                    </div>
                </div>
            </div>
        </Transition> -->
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { mainMenu } from '@/constants/menus'

const isMobileMenuOpen = ref(false)

function toggleMobileMenu() {
    isMobileMenuOpen.value = !isMobileMenuOpen.value
}
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