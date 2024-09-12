<template>
    <div class="relative w-full h-full ">
        <ClientOnly>
            <pre>{{ url }}</pre>
            <vue-plyr class="aspect-video" @statechange="videoTimeUpdated">
                <div data-plyr-provider="youtube" :data-plyr-embed-id="videoId">
                </div>
            </vue-plyr>
        </ClientOnly>
    </div>
</template>

<script setup>
import VuePlyr from 'vue-plyr'

const props = defineProps({
    src: {
        type: String,
        required: true
    }
})

const videoDuration = ref(0)

const videoId = computed(() => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/
    const match = props.src.match(regExp)
    return (match && match[2].length === 11) ? match[2] : null
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