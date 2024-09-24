<template>
   
    <AppContainer class="flex items-center justify-center min-h-[76vh]">
        <div class="flex flex-col gap-3" v-if="!user && isGoogleLoginSupported">
            <AuthGoogleButton @loggedin="" />
        </div>
      <ClientOnly >
        <p class="text-sm text-center text-red-500" v-if="!isGoogleLoginSupported">
            [বি:দ্র: ওয়েবএ্যাপের লিংকটি ক্রোম ব্রাউজারে ওপেন করবে। সরাসরি ফেসবুক অথবা মেসেঞ্জার থেকে লগইন করা যাবে
            না।]
        </p>
     
        <Card class="max-w-[425px] mx-auto" v-else-if="user">
            <CardHeader>
                <CardTitle>কোর্স এক্সেস</CardTitle>
                <CardDescription>
                    আপনি ASG SHOP এর ইনভয়েস থেকে গ্রুপ জয়েনিং আইডি পাবেন
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
                    {{ isEnrolling ? 'যাচাই করা হচ্ছে...' : 'সাবমিট' }}
                </Button>
            </CardFooter>
        </Card>
    </ClientOnly>
    </AppContainer>
</template>

<script setup>
definePageMeta({
    middleware: ['enrolled']
})

import { useToast } from '@/components/ui/toast/use-toast'

const route = useRoute()

const {data } = await useFetch(`/api/courses/${route.params.slug}/course`)

useHead({
    title: data.value.name,
    meta: [
        {
            name: 'og:title',
            content: data.value.name
        },
        {
            name: 'og:image',
            content: data.value.image
        },
        {
            name: 'og:description',
            content: data.value.description
        }
    ]
})





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
        const category = await $fetch(`/api/category/${route.params.shop}`);
      if(category?.is_class){
          return navigateTo(`/${route.params.shop}/${route.params.slug}/lessons`);
      }else{
          return navigateTo(`/${route.params.shop}/${route.params.slug}/mcq`);
      }

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

const user = useUser()



const isGoogleLoginSupported = computed(() => {
    if (import.meta.client) {
        const userAgent = navigator.userAgent.toLowerCase();
        return !userAgent.includes('fban') && !userAgent.includes('fbav');
    }
    return false
})

const { fetchShop } = useShop()
fetchShop()

</script>