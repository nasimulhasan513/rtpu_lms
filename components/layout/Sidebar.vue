<script setup lang="ts">

import { cn } from '@/lib/utils'
import type { NavGroup, NavLink, NavSectionTitle } from '~/types/nav'

defineProps<{
  navMenu: NavGroup[]
  // navMenuBottom: NavGroup[]
}>()


const { shop, fetchShop } = useShop()
const store = useNavbar()
const { toggle } = store

const { isOpen } = storeToRefs(store)

function resolveNavItemComponent(item: NavLink | NavGroup | NavSectionTitle) {
  if ('heading' in item)
    return resolveComponent('LayoutNavHeading')
  else if ('children' in item)
    return resolveComponent('LayoutNavGroup')

  return resolveComponent('LayoutNavLink')
}


const route = useRoute()

fetchShop()

</script>

<template>
  <aside
    class="fixed left-0 z-20 flex-col items-center hidden h-full duration-300 border-r inset-y bg-background transition-width sm:flex print:hidden"
    :class="cn('w-20 lg:w-64', isOpen ? 'lg:w-64' : 'lg:w-20')">
    <div class="relative px-3 py-2 text-center border-b" :class="cn('w-20 lg:w-64', isOpen ? 'lg:w-64' : 'lg:w-20')">
      <div class="flex items-center gap-3"
        :class="cn('justify-center lg:justify-start', isOpen ? 'lg:justify-start' : 'lg:justify-center')">
        <Button variant="outline" size="icon" aria-label="Home">
          R
        </Button>
        <div>
          <span v-if="isOpen" class="hidden text-xl font-semibold lg:inline-block text-primary">
            RTPU
          </span>
        </div>
      </div>

      <Button variant="outline" class="absolute hidden p-0 rounded-full top-4 size-6 -right-3 lg:inline-flex"
        @click="toggle">
        <Icon :name="isOpen ? 'radix-icons:chevron-left' : 'radix-icons:chevron-right'" />
      </Button>
    </div>
    <ScrollArea class="w-full">
      <nav class="grid w-full gap-1 p-2">
        <component :is="resolveNavItemComponent(item)" v-for="(item, index) in navMenu" :key="index" :item="item" />
      </nav>
    </ScrollArea>
    <!-- <nav class="grid w-full gap-1 p-2 mt-auto">
      <component :is="resolveNavItemComponent(item)" v-for="(item, index) in navMenuBottom" :key="index" :item="item" />
    </nav> -->
  </aside>
</template>

<style scoped></style>
