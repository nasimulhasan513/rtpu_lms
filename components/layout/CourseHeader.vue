<script setup lang="ts">
import { CircleUser, Menu, } from 'lucide-vue-next'
import type { NavGroup, NavLink, NavSectionTitle } from '~/types/nav'


defineProps<{
  navMenu: NavLink[]
  // navMenuBottom: NavLink[]
}>()

const user = useUser()
async function handleLogout() {
  await $fetch('/api/logout', { method: 'POST' })
  user.value = null
  navigateTo('/')
}

function resolveNavItemComponent(item: NavLink | NavGroup | NavSectionTitle) {
  if ('heading' in item)
    return resolveComponent('LayoutNavHeadingMobile')
  else if ('children' in item)
    return resolveComponent('LayoutNavGroupMobile')

  return resolveComponent('LayoutNavLinkMobile')
}

const color = useColorMode()

const isMediumScreen = useMediaQuery('(min-width: 768px)')

const { shop } = useShop()
</script>

<template>
  <header class="sticky top-0 z-10 h-[53px] flex items-center gap-4 border-b bg-background px-4 md:px-6 print:hidden">
    <div class="flex items-center w-full gap-4">
      <Sheet>
        <SheetTrigger as-child>
          <Button size="icon" variant="outline" class="sm:hidden">
            <Menu />
            <span class="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent aria-describedby="radix-vue-dialog-description-1" side="left" class="flex flex-col p-4">
          <SheetHeader>
            <SheetTitle class="flex items-center gap-3">

              <Button variant="outline" size="icon" aria-label="Home">
                <img src="~/assets/logo.png" alt="Admin" />
              </Button>
              <span>
                {{ shop?.platformName }}
              </span>
            </SheetTitle>
          </SheetHeader>
          <ScrollArea class="w-full">
            <nav class="grid gap-2">
              <component :is="resolveNavItemComponent(item)" v-for="(item, index) in navMenu" :key="index"
                :item="item" />
            </nav>
          </ScrollArea>
          <!-- <div class="mt-auto">
            <nav class="grid gap-2">
              <component :is="resolveNavItemComponent(item)" v-for="(item, index) in navMenuBottom" :key="index"
                :item="item" />
            </nav>
          </div> -->
        </SheetContent>
      </Sheet>

      <div>

        <h2 class="text-xl font-bold lg:hidden">
          {{ shop?.platformName }}
        </h2>

      </div>

      <div class="flex items-center gap-4 ml-auto">

        <DropdownMenu>
          <DropdownMenuTrigger as-child>
            <Button id="radix-vue-dropdown-menu-trigger-1" variant="secondary" size="icon" class="rounded-full">
              <Avatar v-if="user?.image">
                <AvatarImage :src="user.image" :alt="user.name" class="w-6 h-6" />
                <AvatarFallback>
                  <CircleUser class="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <Avatar v-else>
                <AvatarFallback>
                  <CircleUser class="w-5 h-5" />
                </AvatarFallback>
              </Avatar>
              <span class="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="w-56" align="end">
            <DropdownMenuLabel class="flex font-normal">
              <div class="flex flex-col space-y-1">
                <p class="text-sm font-medium leading-none">
                  {{ user.name }}
                </p>
                <p class="text-xs leading-none text-muted-foreground">
                  {{ user.email || user.phone }}
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem @click="navigateTo('/profile')">
                প্রোফাইল

              </DropdownMenuItem>
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  <span>থিম</span>
                </DropdownMenuSubTrigger>
                <DropdownMenuPortal>
                  <DropdownMenuSubContent>
                    <DropdownMenuItem @click="color.preference = 'light'">
                      <Icon name="i-ph-sun-dim-duotone" size="16" />
                      <span class="ml-2">Light</span>
                      <Icon v-if="color.preference === 'light'" name="i-radix-icons-check" size="16" class="ml-auto" />
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="color.preference = 'dark'">
                      <Icon name="i-ph-moon-stars-duotone" size="16" />
                      <span class="ml-2">Dark</span>
                      <Icon v-if="color.preference === 'dark'" name="i-radix-icons-check" size="16" class="ml-auto" />
                    </DropdownMenuItem>
                    <DropdownMenuItem @click="color.preference = 'system'">
                      <Icon name="i-lucide-monitor" size="16" />
                      <span class="ml-2">System</span>
                      <Icon v-if="color.preference === 'system'" name="i-radix-icons-check" size="16" class="ml-auto" />
                    </DropdownMenuItem>
                  </DropdownMenuSubContent>
                </DropdownMenuPortal>
              </DropdownMenuSub>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem @click="handleLogout">
              লগ আউট
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
</template>

<style scoped></style>
