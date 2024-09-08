<template>
    <div class="p-6">
        <h1 class="mb-4 text-2xl font-bold">Live Class Stream</h1>
        <div v-if="liveClass">
            <h2 class="mb-2 text-xl font-semibold">{{ liveClass.title }}</h2>
            <div id="agora-video-container" ref="videoContainer" class="mt-6 bg-gray-100 h-96"></div>
            <div class="mt-4 space-x-2">
                <Button @click="toggleAudio">{{ isAudioEnabled ? 'Mute' : 'Unmute' }}</Button>
                <Button @click="toggleVideo">{{ isVideoEnabled ? 'Stop Video' : 'Start Video' }}</Button>
                <Button @click="endStream" variant="destructive">End Stream</Button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useToast } from '@/components/ui/toast'

const route = useRoute()
const router = useRouter()
const { toast } = useToast()

const liveClass = ref(null)
const videoContainer = ref(null)
const isAudioEnabled = ref(true)
const isVideoEnabled = ref(true)

let agoraClient = null
let localAudioTrack = null
let localVideoTrack = null

const AGORA_APP_ID = '95ef097222fd435d8819aa2ae8ad1870'
const token = '007eJxTYPhzWDZ6+s+3Hz6d7zzjekjsVH7qjjeLzslFFYk7nlr0wEhIgcHSNDXNwNLcyMgoLcXE2DTFwsLQMjHRKDHVIjHF0MLcQGLz3bSGQEYG8eSfTIwMEAjiSzDkZJal6ibnJBYX6xqaG5laGBgbGxmZmhgzMAAAN/gnNg=='

onMounted(async () => {
    await fetchLiveClass()
    if (import.meta.client) {
        const AgoraRTC = await import('agora-rtc-sdk-ng')
        agoraClient = AgoraRTC.default.createClient({ mode: 'rtc', codec: 'vp8' })
        await joinChannel()
    }
})

onUnmounted(() => {
    if (import.meta.client) {
        leaveChannel()
    }
})

const fetchLiveClass = async () => {
    try {
        const response = await $fetch(`/api/live-classes/${route.params.id}`)
        liveClass.value = response
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to fetch live class details',
        })
    }
}

const joinChannel = async () => {
    if (!import.meta.client) return

    try {
        const AgoraRTC = await import('agora-rtc-sdk-ng')
        await agoraClient.join(AGORA_APP_ID, liveClass.value.channelName, token, null)
        localAudioTrack = await AgoraRTC.default.createMicrophoneAudioTrack()
        localVideoTrack = await AgoraRTC.default.createCameraVideoTrack()
        await agoraClient.publish([localAudioTrack, localVideoTrack])
        localVideoTrack.play(videoContainer.value)
    } catch (error) {
        console.error('Error joining Agora channel:', error)
        toast({
            title: 'Error',
            description: 'Failed to join Agora channel: ' + error.message,
        })
    }
}

const leaveChannel = async () => {
    if (!import.meta.client) return

    if (localAudioTrack) {
        localAudioTrack.close()
    }
    if (localVideoTrack) {
        localVideoTrack.close()
    }
    await agoraClient.leave()
}

const toggleAudio = () => {
    if (localAudioTrack) {
        isAudioEnabled.value ? localAudioTrack.setEnabled(false) : localAudioTrack.setEnabled(true)
        isAudioEnabled.value = !isAudioEnabled.value
    }
}

const toggleVideo = () => {
    if (localVideoTrack) {
        isVideoEnabled.value ? localVideoTrack.setEnabled(false) : localVideoTrack.setEnabled(true)
        isVideoEnabled.value = !isVideoEnabled.value
    }
}

const endStream = async () => {
    try {
        await $fetch(`/api/live-classes/${liveClass.value.id}`, {
            method: 'PUT',
            body: { status: 'ENDED' },
        })
        await leaveChannel()
        router.push('/admin/live')
        toast({
            title: 'Stream Ended',
            description: 'Your live class stream has been ended.',
        })
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to end the stream',
        })
    }
}
</script>