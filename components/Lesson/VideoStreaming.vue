<template>
    <div class="relative w-full h-full">
        <ClientOnly>
            <vue-plyr class="aspect-video" @ready="onPlayerReady" @timeupdate="videoTimeUpdated">
                <video>
                    <source :src="`/api/video/stream?v=${videoId}`" type="application/x-mpegURL">
                </video>
            </vue-plyr>
        </ClientOnly>
    </div>
</template>

<script setup>
import VuePlyr from 'vue-plyr'
import { ref, computed } from 'vue'

const props = defineProps({
    src: {
        type: String,
        required: true
    }
})

const videoDuration = ref(0)

const videoId = computed(() => {
    const url = new URL(props.src);
    return url.searchParams.get('v');
})

const onPlayerReady = (player) => {
    videoDuration.value = player.duration
}

const videoTimeUpdated = (event) => {
    console.log(event)
}
</script>

<style scoped>
/* Custom styles for vue-plyr */
:deep(.plyr--full-ui input[type=range]) {
    color: hsl(172, 87%, 21%);
}

:deep(.plyr__control--overlaid) {
    background: hsla(172, 87%, 21%, 0.8);
}

:deep(.plyr--video .plyr__control:hover) {
    background: hsl(172, 87%, 21%);
}

:deep(.plyr--full-ui input[type=range]::-webkit-slider-thumb) {
    background: hsl(172, 87%, 21%);
}

:deep(.plyr--full-ui input[type=range]::-moz-range-thumb) {
    background: hsl(172, 87%, 21%);
}

:deep(.plyr--full-ui input[type=range]::-ms-thumb) {
    background: hsl(172, 87%, 21%);
}

:deep(.plyr__control.plyr__tab-focus) {
    box-shadow: 0 0 0 5px hsla(172, 87%, 21%, 0.5);
}

:deep(.plyr__menu__container .plyr__control[role=menuitemradio][aria-checked=true]::before) {
    background: hsl(172, 87%, 21%);
}
</style>