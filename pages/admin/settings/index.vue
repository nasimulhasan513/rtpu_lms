<template>


    <div>
        <Card>
            <CardHeader>
                <CardTitle>Basic Settings</CardTitle>
                <CardDescription>Update your website's basic settings.</CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-6">
                    <div class="grid gap-2">
                        <Label for="title">Title</Label>
                        <Input id="title" placeholder="Enter your website title" v-model="title" />
                    </div>
                    <div class="grid gap-2">
                        <Label for="description">Description</Label>
                        <Textarea id="description" placeholder="Enter your website description" class="min-h-[100px]"
                            v-model="description" />
                    </div>


                    <h2 class="font-semibold">
                        Images
                    </h2>

                    <div class="flex flex-wrap gap-3">

                        <AppUploader prefix="info" label="Logo" />
                        <AppUploader prefix="info" label="Favicon" />
                        <AppUploader prefix="info" label="OG Image" />

                    </div>



                </div>
            </CardContent>
        </Card>
        <div class="flex justify-end gap-2 pt-8">
            <Button variant="outline">Discard Changes</Button>
            <Button>Save Changes</Button>
        </div>
    </div>
</template>

<script setup>

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})




const title = useSetting('title')
const description = useSetting('description')



</script>

<style lang="scss" scoped></style>