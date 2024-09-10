<template>
    <div class="p-6">
        <h1 class="mb-4 text-2xl font-bold">Live Class Stream</h1>
        <div v-if="liveClass">
            <h2 class="mb-2 text-xl font-semibold">{{ liveClass.title }}</h2>
            <div class="flex">
                <div id="agora-video-container" ref="videoContainer" class="flex-grow mt-6 bg-gray-100 h-96"></div>
                <div class="w-64 ml-4">
                    <h3 class="mb-2 text-lg font-semibold">Participants</h3>
                    <ul class="space-y-2">
                        <li v-for="user in joinedUsers" :key="user.uid" class="flex items-center justify-between">
                            <span>{{ user.uid }}</span>
                            <Button @click="pinUser(user)" size="sm">
                                {{ pinnedUser?.uid === user.uid ? 'Unpin' : 'Pin' }}
                            </Button>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="mt-4 space-x-2">
                <Button @click="toggleAudio">{{ isAudioEnabled ? 'Mute' : 'Unmute' }}</Button>
                <Button @click="toggleVideo">{{ isVideoEnabled ? 'Stop Video' : 'Start Video' }}</Button>
                <Button @click="toggleScreenShare">{{ isScreenSharing ? 'Stop Sharing' : 'Share Screen' }}</Button>
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
const isScreenSharing = ref(false)

const joinedUsers = ref([])
const pinnedUser = ref(null)

let agoraClient = null
let localAudioTrack = null
let localVideoTrack = null
let screenTrack = null
const AGORA_APP_ID = '95ef097222fd435d8819aa2ae8ad1870'
const AGORA_TOKEN = "007eJxTYNjF+jVnac9WIytzm/UneN5yTm/505/dfcr7VIh+9vnW/JkKDJamqWkGluZGRkZpKSbGpikWFoaWiYlGiakWiSmGFuYGGw7cTWsIZGT4vNGJhZEBAkF8CYaczLJU3eScxOJiXUNzI1MLA2NjIyNTE2MGBgBngCYY"
onMounted(async () => {
    await fetchLiveClass()
    if (import.meta.client) {
        const AgoraRTC = await import('agora-rtc-sdk-ng')
        agoraClient = AgoraRTC.default.createClient({ mode: 'rtc', codec: 'vp8' })
        setupEventListeners()
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

const setupEventListeners = () => {
    agoraClient.on('user-published', handleUserPublished)
    agoraClient.on('user-unpublished', handleUserUnpublished)
    agoraClient.on('user-joined', handleUserJoined)
    agoraClient.on('user-left', handleUserLeft)
}

const handleUserPublished = async (user, mediaType) => {
    await agoraClient.subscribe(user, mediaType)
    if (mediaType === 'video') {
        const remoteVideoTrack = user.videoTrack
        remoteVideoTrack.play(`remote-video-${user.uid}`)
    }
    if (mediaType === 'audio') {
        const remoteAudioTrack = user.audioTrack
        remoteAudioTrack.play()
    }
    rearrangeVideoLayout()
}

const handleUserUnpublished = (user, mediaType) => {
    if (mediaType === 'video') {
        const remoteVideoContainer = document.getElementById(`remote-video-${user.uid}`)
        if (remoteVideoContainer) remoteVideoContainer.innerHTML = ''
    }
    rearrangeVideoLayout()
}

const handleUserJoined = (user) => {
    joinedUsers.value.push(user)
    rearrangeVideoLayout()
}

const handleUserLeft = (user) => {
    joinedUsers.value = joinedUsers.value.filter(u => u.uid !== user.uid)
    if (pinnedUser.value?.uid === user.uid) {
        pinnedUser.value = null
    }
    rearrangeVideoLayout()
}

const joinChannel = async () => {
    if (!import.meta.client) return

    try {
        // const { token } = await $fetch('/api/agora/token', {
        //     method: 'POST',
        //     body: { channelName: liveClass.value.channelName }
        // })

        const AgoraRTC = await import('agora-rtc-sdk-ng')
        await agoraClient.join(AGORA_APP_ID, liveClass.value.channelName, AGORA_TOKEN, null)
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

    localAudioTrack?.close()
    localVideoTrack?.close()
    screenTrack?.close()
    await agoraClient.leave()
}

const toggleAudio = () => {
    if (localAudioTrack) {
        isAudioEnabled.value = !isAudioEnabled.value
        localAudioTrack.setEnabled(isAudioEnabled.value)
    }
}

const toggleVideo = () => {
    if (localVideoTrack) {
        isVideoEnabled.value = !isVideoEnabled.value
        localVideoTrack.setEnabled(isVideoEnabled.value)
    }
}

const toggleScreenShare = async () => {
    if (!isScreenSharing.value) {
        screenTrack = await AgoraRTC.createScreenVideoTrack()
        await agoraClient.unpublish(localVideoTrack)
        await agoraClient.publish(screenTrack)
        screenTrack.play(videoContainer.value)
        isScreenSharing.value = true
    } else {
        await agoraClient.unpublish(screenTrack)
        screenTrack.close()
        await agoraClient.publish(localVideoTrack)
        localVideoTrack.play(videoContainer.value)
        isScreenSharing.value = false
    }
    rearrangeVideoLayout()
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

const pinUser = (user) => {
    pinnedUser.value = pinnedUser.value?.uid === user.uid ? null : user
    rearrangeVideoLayout()
}

const rearrangeVideoLayout = () => {
    if (!agoraClient) return

    const videoCont= videoContainer.value
    videoCont.innerHTML = ''

    const createVideoElement = (user, width, height) => {
        const videoElement = document.createElement('div')
        videoElement.id = `remote-video-${user.uid}`
        videoElement.style.width = width
        videoElement.style.height = height
        videoElement.style.display = 'inline-block'
        videoCont.appendChild(videoElement)
        user.videoTrack?.play(`remote-video-${user.uid}`)
    }

    if (pinnedUser.value) {
        createVideoElement(pinnedUser.value, '100%', '70%')

        const otherVideosContainer = document.createElement('div')
        otherVideosContainer.style.display = 'flex'
        otherVideosContainer.style.height = '30%'
        videoContainer.appendChild(otherVideosContainer)

        agoraClient.remoteUsers.forEach(user => {
            if (user.uid !== pinnedUser.value.uid) {
                createVideoElement(user, '25%', '100%')
            }
        })
    } else {
        const videosPerRow = Math.ceil(Math.sqrt(agoraClient.remoteUsers.length + 1))
        const videoWidth = `${100 / videosPerRow}%`
        const videoHeight = `${100 / Math.ceil((agoraClient.remoteUsers.length + 1) / videosPerRow)}%`

        agoraClient.remoteUsers.forEach(user => {
            createVideoElement(user, videoWidth, videoHeight)
        })

        // Add local video
        createVideoElement({ uid: 'local', videoTrack: isScreenSharing.value ? screenTrack : localVideoTrack }, videoWidth, videoHeight)
    }
}
</script>