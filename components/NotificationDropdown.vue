<template>
    <DropdownMenu>
        <DropdownMenuTrigger as-child>
            <Button variant="ghost" size="icon">
                <Icon name="lucide:bell" class="w-5 h-5" />
                <span class="sr-only">Notifications</span>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" class="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <!-- Add notification items here -->
            <DropdownMenuItem v-for="notification in notifications" :key="notification.id">
                {{ notification.message }}
            </DropdownMenuItem>
            <!-- Show a message when there are no notifications -->
            <DropdownMenuItem v-if="notifications.length === 0" disabled>
                No new notifications
            </DropdownMenuItem>
        </DropdownMenuContent>
    </DropdownMenu>
</template>

<script setup>

// Mock notifications data (replace with actual data fetching logic)
const notifications = ref([
    { id: 1, message: 'New course available: Vue.js Mastery' },
    { id: 2, message: 'Your assignment has been graded' }
])
</script>