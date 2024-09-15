<template>
    <ClientOnly>
        <div class="relative">
            <div class="flex flex-row items-center gap-3">
                <template v-if="user">
                    <DropdownMenu>
                        <DropdownMenuTrigger as-child>
                            <Button variant="ghost"
                                class="flex items-center gap-3 pl-1 transition border rounded-full cursor-pointer border-neutral-100 hover:shadow-md hover:bg-transparent">
                                <Avatar class="w-7 h-7">
                                    <AvatarImage :src="user.image" :alt="user.name" />
                                    <AvatarFallback>{{ user.name.charAt(0) }}</AvatarFallback>
                                </Avatar>
                                <span class="hidden text-sm font-medium md:block">
                                    {{ user.name }}
                                </span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent class="w-56" align="end">
                            <DropdownMenuItem @click="navigateTo('/profile')">
                                প্রোফাইল
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="user.role !== 'user'" @click="navigateTo('/admin')">
                                Admin Panel
                            </DropdownMenuItem>
                            <DropdownMenuSub>
                                <DropdownMenuSubTrigger>
                                    <span>থীম</span>
                                </DropdownMenuSubTrigger>
                                <DropdownMenuPortal>
                                    <DropdownMenuSubContent>
                                        <DropdownMenuItem @click="color.preference = 'light'">
                                            <Icon name="i-ph-sun-dim-duotone" size="16" />
                                            <span class="ml-2">Light</span>
                                            <Icon v-if="color.preference === 'light'" name="i-radix-icons-check"
                                                size="16" class="ml-auto" />
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="color.preference = 'dark'">
                                            <Icon name="i-ph-moon-stars-duotone" size="16" />
                                            <span class="ml-2">Dark</span>
                                            <Icon v-if="color.preference === 'dark'" name="i-radix-icons-check"
                                                size="16" class="ml-auto" />
                                        </DropdownMenuItem>
                                        <DropdownMenuItem @click="color.preference = 'system'">
                                            <Icon name="i-lucide-monitor" size="16" />
                                            <span class="ml-2">System</span>
                                            <Icon v-if="color.preference === 'system'" name="i-radix-icons-check"
                                                size="16" class="ml-auto" />
                                        </DropdownMenuItem>
                                    </DropdownMenuSubContent>
                                </DropdownMenuPortal>
                            </DropdownMenuSub>
                            <DropdownMenuItem @click="logout">
                                <Icon name="lucide:log-out" class="w-4 h-4 mr-2" />
                                লগআউট
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </template>
                <Button v-else @click="onOpen">
                    লগইন
                </Button>

            </div>
        </div>
    </ClientOnly>
</template>

<script setup>


const { onOpen } = useLogin()

const color = useColorMode()

const user = useUser()

async function logout() {
    await $fetch('/api/logout', { method: 'POST' })
    user.value = null
    navigateTo('/')
}
</script>

<style lang="scss" scoped></style>