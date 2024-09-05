<template>
    <div>

        <div class="">
            <div class="grid gap-8">


                <Card>
                    <CardHeader>
                        <CardTitle>Contact Settings</CardTitle>
                        <CardDescription>Update your website's contact information.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div class="grid gap-6">
                            <div class="grid gap-2">
                                <Label htmlFor="facebook">Facebook</Label>
                                <Input id="facebook" placeholder="Enter your Facebook page URL" />
                            </div>
                            <div class="grid gap-2">
                                <Label htmlFor="youtube">YouTube</Label>
                                <Input id="youtube" placeholder="Enter your YouTube channel URL" />
                            </div>
                            <div class="grid gap-2">
                                <Label htmlFor="phone">Phone</Label>
                                <Input id="phone" placeholder="Enter your phone number" />
                            </div>
                            <div class="grid gap-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" placeholder="Enter your email address" />
                            </div>
                            <div class="grid gap-2">
                                <Label htmlFor="address">Address</Label>
                                <Textarea id="address" placeholder="Enter your address" class="min-h-[100px]" />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
            <div class="flex justify-end gap-2 pt-8">
                <Button variant="outline">Discard Changes</Button>
                <Button>Save Changes</Button>
            </div>
        </div>

    </div>
</template>

<script setup>

definePageMeta({
    layout: 'admin',
})


</script>

<style lang="scss" scoped></style>