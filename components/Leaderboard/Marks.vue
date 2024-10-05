<template>
    <div class="flex items-center justify-center">
        <span>Marks</span>
        <Popover>
            <PopoverTrigger>
                <Button variant="ghost" size="sm" aria-label="Details" class="p-0 ml-1 print:hidden">
                    <Icon name="lucide:info" size="16" />
                </Button>
            </PopoverTrigger>
            <PopoverContent>
                <div class="flex justify-between text-xs">
                    <span class="flex items-center text-green-500">
                        <Icon name="lucide:circle-check" class="mr-1" size="14" />
                        Correct
                    </span>
                    <span class="flex items-center text-red-500">
                        <Icon name="lucide:circle-x" class="mr-1" size="14" />
                        Wrong
                    </span>
                    <span class="flex items-center text-gray-500">
                        <Icon name="lucide:circle-minus" class="mr-1" size="14" />
                        Skipped
                    </span>
                </div>
            </PopoverContent>
        </Popover>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

</style>