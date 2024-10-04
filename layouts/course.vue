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
const { course, fetchCourse } = useCourse()
onMounted(() => {
    if (route.params.slug) {
        fetchCourse(route.params.slug as string)
    }
})

watch(slug, (newSlug) => {
    fetchCourse(newSlug as string)
})

const menus = computed(() => {
    let initMenus: any = []
    if (course.value) {
        courseMenu.forEach((item) => {
            if (item.type === "is_class" && course.value.is_class) {
                initMenus.push({
                    ...item,
                    link: `/${route.params.shop}/${slug.value}/${item.link}`,
                })
            }
            if (item.type === "is_mcq" && course.value.is_mcq) {
                initMenus.push({
                    ...item,
                    link: `/${route.params.shop}/${slug.value}/${item.link}`,
                })
            }
            if (item.type === "is_cq" && course.value.is_cq) {
                initMenus.push({
                    ...item,
                    link: `/${route.params.shop}/${slug.value}/${item.link}`,
                })
            }
            if (item.type === "general") {
                initMenus.push({
                    ...item,
                    link: `/${route.params.shop}/${slug.value}/${item.link}`,
                })
            }

            if (item.type === 'all' && course.value?.is_class) {
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
        :class="cn('pl-0 lg:pl-64 sm:pl-20 print:pl-0', isOpen ? 'lg:pl-64 sm:pl-20' : 'lg:pl-20')">
        <ClientOnly>
            <LayoutSidebar :navMenu="menus" />
        </ClientOnly>
        <div flex="~ col">
            <LayoutCourseHeader :navMenu="menus" />
            <main class="flex-1 min-h-[calc(100vh-53px)] p-4 lg:p-6 print:bg-white"
                :class="isBgWhite ? 'bg-background' : 'bg-muted dark:bg-muted/20'">

                <slot />
            </main>
        </div>
    </div>
    <TeacherModal />
</template>

<style scoped></style>
