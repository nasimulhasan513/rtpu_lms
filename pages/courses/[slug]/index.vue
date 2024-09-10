<template>
    <AppContainer class="flex items-center justify-center min-h-[76vh]">
        <Card class="max-w-[425px] mx-auto">
            <CardHeader>
                <CardTitle>কোর্স এক্সেস</CardTitle>
                <CardDescription>
                    আপনি ASG SHOP ইনভয়েস থেকে গ্রুপ জয়েনিং আইডি পাবে
                </CardDescription>
            </CardHeader>
            <CardContent>
                <div class="grid gap-4">
                    <div class="space-y-2">
                        <Label for="uniqueId">
                            অ্যাক্সেস কোড
                        </Label>
                        <Input id="uniqueId" placeholder="গ্রুপ জয়েনিং আইডি" v-model="uniqueId" class="col-span-3" />
                    </div>
                </div>
            </CardContent>
            <CardFooter class="flex justify-end space-x-2">
                <Button @click="enrollCourse" :disabled="isEnrolling">
                    {{ isEnrolling ? 'যাচাই করা হচ্ছে...' : 'অ্যাক্সেস পান' }}
                </Button>
            </CardFooter>
        </Card>
    </AppContainer>
</template>

<script setup>


definePageMeta({
    middleware: 'enrolled'
})



import { useToast } from '@/components/ui/toast/use-toast'
const route = useRoute()
const uniqueId = ref('')
const { toast } = useToast()
const isEnrolling = ref(false)
const enrollCourse = async () => {
    if (!uniqueId.value) {
        toast({
            title: 'Error',
            description: 'Please enter a unique ID',
            variant: 'destructive',
        })
        return
    }


    try {
        isEnrolling.value = true
        const response = await $fetch('/api/enrollment', {
            method: 'POST',
            body: {
                courseId: route.params.slug,
                uniqueId: uniqueId.value,
            },
        })

        toast({
            title: 'Success',
            description: 'You have been enrolled in the course',
        })

        navigateTo(`/courses/${route.params.slug}/dashboard`)


    } catch (error) {
        console.log(error)
        toast({
            title: 'Error',
            description: error.statusMessage || 'Failed to enroll in the course',
            variant: 'destructive',
        })
    } finally {
        isEnrolling.value = false
    }
}





</script>