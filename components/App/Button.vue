<script setup lang="ts">
import { cva } from 'class-variance-authority'

const props = defineProps({
    variant: {
        type: String as () => 'default' | 'primary' | 'secondary' | 'outline',
        default: 'default',
    },
    size: {
        type: String as () => 'default' | 'sm' | 'lg',
        default: 'default',
    },
    loading: {
        type: Boolean,
        default: false,
    },
    loadingText: {
        type: String,
        default: 'অনুগ্রহ করে অপেক্ষা করুন...',
    },
    label: {
        type: String,
        required: true,
    },
    icon: {
        type: String,
        default: '',
    },
});

const buttonVariants = cva(
    'inline-flex items-center text-white justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
    {
        variants: {
            variant: {
                default: 'bg-primary text-primary-foreground hover:bg-primary/90',
                primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
                secondary: 'bg-white text-primary hover:bg-black/10',
                outline: 'border border-input hover:bg-accent hover:text-accent-foreground',
            },
            size: {
                default: 'h-10 py-2 px-4',
                sm: 'h-9 px-3 rounded-md',
                lg: 'h-11 px-8 rounded-md',
                xl: 'h-12 px-10 rounded-md',
                '2xl': 'h-14 px-12 rounded-md',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    }
);

const buttonClasses = computed(() =>
    buttonVariants({ variant: props.variant, size: props.size })
);

const buttonLabel = computed(() => (props.loading ? props.loadingText : props.label));
</script>

<template>
    <button :class="buttonClasses" :disabled="loading">

        {{ buttonLabel }}
        <span v-if="loading" class="ml-2">
            <!-- You can replace this with a proper loading spinner component -->
            <span class="animate-spin">&#9696;</span>
        </span>
        <span v-if="icon" class="mr-2">
            <Icon :name="icon" />
        </span>
    </button>
</template>

<style lang="scss" scoped>
/* From Uiverse.io by absoluteSTrange */
button {
    padding: 17px 40px;
    border-radius: 10px;
    border: 0;
    letter-spacing: 1.5px;
    font-size: 15px;
    transition: all 0.3s ease;
    box-shadow: rgb(201, 46, 70) 0px 10px 0px 0px;
}

button:hover {
    box-shadow: rgb(201, 46, 70) 0px 7px 0px 0px;
}

button:active {
    background-color: rgb(255, 56, 86);
    /*50, 168, 80*/
    box-shadow: rgb(201, 46, 70) 0px 0px 0px 0px;
    transform: translateY(5px);
    transition: 200ms;
}
</style>
