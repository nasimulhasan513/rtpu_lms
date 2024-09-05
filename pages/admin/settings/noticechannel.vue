<template>
    <div>
        <div class="container px-4 py-12 mx-auto md:px-6 lg:px-8">
            <h1 class="mb-8 text-3xl font-bold">Communication and Payment Settings</h1>
            <div class="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
                <div class="p-6 rounded-lg shadow-md bg-card">
                    <h2 class="mb-4 text-xl font-bold">Email API</h2>
                    <p class="mb-4 text-muted-foreground">
                        Configure your email API credentials to enable email notifications.
                    </p>
                    <div class="space-y-4">
                        <div>
                            <Label htmlFor="email-api-key">API Key</Label>
                            <Input id="email-api-key" type="text" placeholder="Enter API key" />
                        </div>
                        <div>
                            <Label htmlFor="email-sender">Sender Email</Label>
                            <Input id="email-sender" type="email" placeholder="Enter sender email" />
                        </div>
                    </div>
                </div>
                <div class="p-6 rounded-lg shadow-md bg-card">
                    <h2 class="mb-4 text-xl font-bold">SMS</h2>
                    <p class="mb-4 text-muted-foreground">Configure your SMS API credentials to enable SMS
                        notifications.</p>
                    <div class="space-y-4">
                        <div>
                            <Label htmlFor="sms-api-key">API Key</Label>
                            <Input id="sms-api-key" type="text" placeholder="Enter API key" />
                        </div>
                        <div>
                            <Label htmlFor="sms-sender">Sender Name</Label>
                            <Input id="sms-sender" type="text" placeholder="Enter sender name" />
                        </div>
                    </div>
                </div>

            </div>
            <div class="flex justify-end mt-8">
                <Button class="bg-primary text-primary-foreground">Save Changes</Button>
            </div>
        </div>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})

</script>

<style lang="scss" scoped></style>