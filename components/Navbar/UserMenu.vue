<template>
    <ClientOnly>


        <div class="relative">
            <div class="flex flex-row items-center gap-3">

                <DropdownMenu v-if="user">
                    <DropdownMenuTrigger as-clild>
                        <Button variant="ghost"
                            class="border-[1px] border-neutral-100 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md hover:bg-transparent transition">
                            <img v-if="user.image" class="w-8 h-8 rounded-full " :src="user.image" :alt="user.name">
                            <Icon v-else name="radix-icons:avatar" class="w-8 h-8 " />
                            <span class="hidden text-sm font-medium md:block text-neutral-600">
                                {{ user.name }}
                            </span>

                        </Button>

                    </DropdownMenuTrigger>
                    <DropdownMenuContent class="w-56" align="end">

                        <template v-if="user">
                            <DropdownMenuItem @click="navigateTo('/profile')">
                                <span>
                                    Profile
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem v-if="user.role !== 'user'" @click="navigateTo('/admin')">
                                <span>
                                    Admin Panel
                                </span>
                            </DropdownMenuItem>
                            <DropdownMenuItem @click="navigateTo('/orders')">
                                <span>
                                    Previous Orders
                                </span>
                            </DropdownMenuItem>

                            <DropdownMenuItem @click="logout">
                                <Icon name="lucide:log-out" class="w-4 h-4 mr-2" />
                                Logout
                            </DropdownMenuItem>
                        </template>

                    </DropdownMenuContent>
                </DropdownMenu>
                <Button v-else @click="navigateTo('/login')">
                    Login
                </Button>
                <!-- <Button class="border-none" variant="outline" @click="isDark = !isDark">
                    <Icon :name="isDark ? 'lucide:moon' : 'lucide:sun'" />
                </Button> -->
            </div>

        </div>
    </ClientOnly>
</template>

<script setup>

const { onOpen: loginModal } = useLogin()



const user = useUser()

async function logout() {
    await $fetch('/api/logout', {
        method: 'POST'
    })
    user.value = null
    navigateTo('/')
}
const colorMode = useColorMode()
const isDark = computed({
    get() {
        return colorMode.value === 'dark'
    },
    set() {
        colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
    }
})

</script>

<style lang="scss" scoped></style>