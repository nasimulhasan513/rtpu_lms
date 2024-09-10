<template>
    <AppModal :isOpen="isOpen" title="Welcome to Rhombus!" description="Please update your information to continue"
        @onClose="onClose" v-if="isOpen">
        <form @submit="updateProfile">
            <div class="space-y-6">

                <FormField v-slot="{ componentField }" name="phone">
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input type="text" placeholder="Phone Number" v-bind="componentField" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                </FormField>
                <FormField v-slot="{ componentField }" name="hsc_batch">
                    <FormItem>
                        <FormLabel>HSC Batch</FormLabel>

                        <Select v-bind="componentField">
                            <FormControl>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select Batch" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                                <SelectGroup v-for="b in hsc_batches" :key="b">
                                    <SelectItem :value="b">
                                        {{ b }}
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        <FormMessage />
                    </FormItem>
                </FormField>

                <AppButton label="Update Profile" loadingLabel="Updating..." :loading="isLoading" class="w-full"
                    type="submit" />

            </div>
        </form>

    </AppModal>
</template>

<script setup>
import { useForm } from 'vee-validate'
import { toTypedSchema } from '@vee-validate/zod'
import { useToast } from '@/components/ui/toast/use-toast'
import { UpdateSchema } from '~/schema/login.schema'
const { isOpen, onClose } = useUpdate()

const formSchema = toTypedSchema(UpdateSchema)
const user = useUser();
const form = useForm({
    validationSchema: formSchema,
    initialValues: {
        phone: user.value.phone,
        hsc_batch: user.value.hsc_batch,
    }
})

const hsc_batches = [
    'HSC 2024',
    'HSC 2025',
    'HSC 2026',
    'Others'
]

const isLoading = ref(false)
const { toast } = useToast()

const assignUser = async () => {

    const data = await useRequestFetch()("/api/user");
    if (data) {
        user.value = data;
    }
}

const updateProfile = form.handleSubmit(async () => {
    try {
        isLoading.value = true
        const { data, error } = await useAsyncData(async () => await $fetch('/api/auth/update', {
            method: 'POST',
            body: (form.values)
        }))
        if (error.value) {
            return toast({
                title: error.value.statusCode.toString(),
                description: error.value.statusMessage,
                variant: 'destructive'
            })
        }
        await assignUser();
        return onClose()
    } catch (error) {
        console.log(error)

    } finally {
        isLoading.value = false
    }
})

</script>
