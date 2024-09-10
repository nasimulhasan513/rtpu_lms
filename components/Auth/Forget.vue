<template>

    <div class="space-y-6 ">
        <form @submit="onSubmit">
            <div class="space-y-6">
                <FormField v-slot="{ componentField }" name="email">
                    <FormItem>
                        <FormLabel>Email or phone number</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Email/Phone Number" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>
            <div class="flex flex-col gap-2 py-6">
                <div class="flex flex-row items-center w-full gap-4">
                    <AppButton type="submit" :loading="isLoading" label="Send Verification Code" class="w-full"
                        loadingText="Sending verification code..." />
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { ForgetSchema } from '~/schema/forget.schema';
const formSchema = toTypedSchema(ForgetSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        email: '',
    }
})

const isLoading = ref(false)
const { toast } = useToast()

const emits = defineEmits(['sendCode',])

const onSubmit = form.handleSubmit(async () => {



    try {
        isLoading.value = true
        const { data, error } = await useAsyncData(() => $fetch('/api/auth/forget', {
            method: 'POST',
            body: form.values
        }))
        if (error.value) {
            return toast({
                title: error.value.statusCode.toString(),
                description: error.value.statusMessage,
                variant: 'destructive'
            })
        }



        localStorage.setItem('resetToken', data.value.token)
        return emits('sendCode')
    } catch (error) {
        return toast({
            title: error.toString(),
            variant: 'destructive'
        })
    } finally {
        isLoading.value = false
    }
})


</script>

<style lang="scss" scoped></style>