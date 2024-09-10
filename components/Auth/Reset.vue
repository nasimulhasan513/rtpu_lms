<template>

    <div class="space-y-6 ">
        <form @submit="onSubmit">
            <div class="space-y-6">
                <FormField v-slot="{ componentField }" name="password">
                    <FormItem>
                        <FormLabel>New Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="******" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="confirm_password">
                    <FormItem>
                        <FormLabel>Confirm New Password</FormLabel>
                        <FormControl>
                            <Input type="password" placeholder="******" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
            </div>
            <div class="flex flex-col gap-2 py-6">
                <div class="flex flex-row items-center w-full gap-4">
                    <AppButton type="submit" :loading="isLoading" label="Reset Password" class="w-full"
                        loadingText="Reseting..." />
                </div>
            </div>
        </form>
    </div>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { ResetSchema } from '~/schema/forget.schema';
const formSchema = toTypedSchema(ResetSchema)

const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        password: '',
        confirm_password: ''
    }
})

const isLoading = ref(false)
const { toast } = useToast()

const emits = defineEmits(['sendCode',])

const onSubmit = form.handleSubmit(async () => {
    try {
        isLoading.value = true

        let token = localStorage.getItem('resetToken')
        let otp = localStorage.getItem('_o')


        const { data, error } = await useAsyncData(() => $fetch('/api/auth/reset', {
            method: 'POST',
            body: {
                otp, token, newPassword: form.values.password
            }
        }))
        if (error.value) {
            return toast({
                title: error.value.statusCode.toString(),
                description: error.value.statusMessage,
                variant: 'destructive'
            })
        }
        localStorage.removeItem('resetToken', data.token)
        localStorage.removeItem('_o')
        toast({
            title: 'Password reset successful',
            description: "Please login with your new password",
        })


        return navigateTo('/')
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