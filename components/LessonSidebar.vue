<template>
    <Card class="mb-6">
        <CardHeader>
            <CardTitle>{{ title }}</CardTitle>
        </CardHeader>
        <CardContent>
            <ScrollArea class="h-[300px]">
                <Button v-if="showBackButton" variant="outline" class="w-full mb-2" @click="$emit('back')">
                    <ChevronLeft class="w-4 h-4 mr-2" />
                    Back
                </Button>
                <div class="space-y-2">
                    <Button v-for="item in items" :key="item.id" variant="ghost" class="justify-start w-full"
                        :class="{ 'bg-primary/10': currentItemId === item.id }" @click="$emit('select', item.id)">
                        <CheckCircle2 v-if="isCompleted(item.id)" class="w-4 h-4 mr-2" />
                        <Circle v-else class="w-4 h-4 mr-2" />
                        {{ item.name || item.title }}
                    </Button>
                </div>
            </ScrollArea>
        </CardContent>
    </Card>
</template>

<script setup lang="ts">
import { CheckCircle2, Circle, ChevronLeft } from 'lucide-vue-next'

defineProps<{
    title: string
    items: Array<{ id: string; name?: string; title?: string }>
    currentItemId: string | null
    showBackButton: boolean
    isCompleted: (id: string) => boolean
}>()

defineEmits<{
    (e: 'select', id: string): void
    (e: 'back'): void
}>()
</script>