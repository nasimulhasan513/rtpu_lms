<script setup lang="ts">
import { courseMenu } from '~/constants/menus'
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

const router = useRouter()

defineShortcuts({
    'Meta_B': () => store.toggle(),
    'G-H': () => router.push('/'),
    'G-E': () => router.push('/email'),
})


const route = useRoute()
const slug = computed(() => route.params.slug as string)
const { shop,fetchShop } = useShop()
onMounted(async () => {
    await fetchShop()
})

const menus = computed(() => {
    let initMenus:any = []
    if(shop.value){
    courseMenu.forEach((item) => {
        if(item.type === "is_class" && shop.value.is_class){
            initMenus.push({
                ...item,
                link: `/${route.params.shop}/${slug.value}/${item.link}`,
            })
        }
        if(item.type === "is_mcq" && shop.value.is_mcq){
            initMenus.push({
                ...item,
                link: `/${route.params.shop}/${slug.value}/${item.link}`,
            })
        }
        if(item.type === "is_cq" && shop.value.is_cq){
            initMenus.push({
                ...item,
                link: `/${route.params.shop}/${slug.value}/${item.link}`,
            })
        }

        if(item.type==='all' && shop.value?.is_class){
            initMenus.push({
                ...item,
                link: `/${route.params.shop}/${slug.value}/${item.link}`,
            })
            }
        })
    }
    return initMenus
})



</script>

<template>
    <div class="grid w-full duration-300 transition-width min-h-dvh"
        :class="cn('pl-0 lg:pl-64 sm:pl-20', isOpen ? 'lg:pl-64 sm:pl-20' : 'lg:pl-20')">
        <ClientOnly >
            <LayoutSidebar :navMenu="menus" />
        </ClientOnly>
        <div flex="~ col">
            <LayoutCourseHeader :navMenu="menus" />
            <main class="flex-1 min-h-[calc(100vh-53px)] p-4 lg:p-6"
                :class="isBgWhite ? 'bg-background' : 'bg-muted dark:bg-muted/20'">
              
                <slot />
            </main>
        </div>
    </div>
    <TeacherModal />
</template>

<style scoped></style>
