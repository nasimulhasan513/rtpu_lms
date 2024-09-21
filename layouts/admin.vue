<script setup lang="ts">
import { navMenu, navMenuBottom } from '~/constants/menus'
const store = useNavbar()
const { isOpen } = storeToRefs(store)
const { isBgWhite } = storeToRefs(useAppConf())
const { theme, radius } = useCustomize()

useServerHead({
    bodyAttrs: {
        class: `theme-${theme.value}`,
        style: `--radius: ${radius.value}rem;`,
    },
})


const user = useUser()

const rbacMenus = computed(() => {
    if (user.value?.role === 'admin') {
        return navMenu
    }
    return navMenu.filter(menu => {
        if ('role' in menu && menu.role === user.value?.role) {
            if ('children' in menu) {
                menu.children = menu.children.filter(child => child.role === user.value?.role)
            }
            return true
        }
        return false
    })
})





const router = useRouter()

defineShortcuts({
    'Meta_B': () => store.toggle(),
    'G-H': () => router.push('/'),
    'G-E': () => router.push('/email'),
})
</script>

<template>
    <div class="grid w-full duration-300 transition-width min-h-dvh"
        :class="cn('pl-0 lg:pl-64 sm:pl-20', isOpen ? 'lg:pl-64 sm:pl-20' : 'lg:pl-20')">
        <LayoutSidebar :navMenu="rbacMenus" :navMenuBottom="navMenuBottom" />
        <div flex="~ col">
            <LayoutHeader />
            <main class="flex-1 min-h-[calc(100vh-53px)] p-4 lg:p-6 print:p-0 "
                :class="isBgWhite ? 'bg-background' : 'bg-muted dark:bg-muted/20'">


                <slot />
            </main>
        </div>
    </div>
    <TeacherModal />
</template>

<style scoped></style>
