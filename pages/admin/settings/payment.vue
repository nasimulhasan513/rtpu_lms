<template>
    <div>
        <div class="grid gap-8">

            <div class="p-6 rounded-lg shadow-md bg-card">
                <h2 class="mb-4 text-xl font-bold">Bkash</h2>
                <p class="mb-4 text-muted-foreground">Configure your Bkash payment gateway credentials.</p>
                <div class="space-y-4">
                    <div>
                        <Label htmlFor="bkash-api-key">API Key</Label>
                        <Input id="bkash-api-key" type="text" placeholder="Enter API key" />
                    </div>
                    <div>
                        <Label htmlFor="bkash-api-secret">API Secret</Label>
                        <Input id="bkash-api-secret" type="password" placeholder="Enter API secret" />
                    </div>
                    <div class="flex items-center justify-between">
                        <span>Enable Bkash</span>
                        <Switch />
                    </div>
                </div>
            </div>
            <div class="p-6 rounded-lg shadow-md bg-card">
                <h2 class="mb-4 text-xl font-bold">SSL Commerx</h2>
                <p class="mb-4 text-muted-foreground">Configure your SSL Commerx payment gateway credentials.
                </p>
                <div class="space-y-4">
                    <div>
                        <Label htmlFor="ssl-api-key">API Key</Label>
                        <Input id="ssl-api-key" type="text" placeholder="Enter API key" />
                    </div>
                    <div>
                        <Label htmlFor="ssl-api-secret">API Secret</Label>
                        <Input id="ssl-api-secret" type="password" placeholder="Enter API secret" />
                    </div>
                    <div class="flex items-center justify-between">
                        <span>Enable SSL Commerx</span>
                        <Switch />
                    </div>
                </div>
            </div>
        </div>
        <div class="flex justify-end mt-8">
            <Button class="bg-primary text-primary-foreground">Save Changes</Button>
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