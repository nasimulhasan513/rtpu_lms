<template>
    <div class="p-6">
        <h1 class="mb-4 text-2xl font-bold">Live Class Management</h1>

        <!-- Schedule Live Class Form -->
        <div class="mb-6">
            <h2 class="mb-2 text-xl font-semibold">Schedule Live Class</h2>
            <form @submit.prevent="scheduleLiveClass" class="space-y-4">
                <Input v-model="newClass.title" placeholder="Class Title" required />
                <Textarea v-model="newClass.description" placeholder="Class Description" />
                <Input v-model="newClass.startTime" type="datetime-local" required />
                <Input v-model="newClass.endTime" type="datetime-local" required />
                <Button type="submit">Schedule Class</Button>
            </form>
        </div>

        <!-- Upcoming Live Classes -->
        <div class="mb-6">
            <h2 class="mb-2 text-xl font-semibold">Upcoming Live Classes</h2>
            <div v-if="upcomingClasses.length" class="space-y-4">
                <div v-for="liveClass in upcomingClasses" :key="liveClass.id" class="p-4 border rounded">
                    <h3 class="font-semibold">{{ liveClass.title }}</h3>
                    <p>{{ new Date(liveClass.startTime).toLocaleString() }}</p>
                    <Button @click="startLiveClass(liveClass)" :disabled="isLiveClassActive">
                        Start Live Class
                    </Button>
                </div>
            </div>
            <p v-else>No upcoming classes scheduled.</p>
        </div>

        <!-- Active Live Class -->
        <div v-if="activeLiveClass">
            <h2 class="mb-2 text-xl font-semibold">Active Live Class: {{ activeLiveClass.title }}</h2>
            <div class="space-y-2">
                <Button @click="toggleChat">{{ isChatEnabled ? 'Disable Chat' : 'Enable Chat' }}</Button>
                <Button @click="createPoll">Create Poll</Button>
                <Button @click="navigateTo(`/admin/live/${activeLiveClass.id}/stream`)">Enter Live Class</Button>
                <Button @click="endLiveClass" variant="destructive">End Live Class</Button>
            </div>
            <div id="agora-video-container" ref="videoContainer" class="mt-6 bg-gray-100 h-96"></div>
        </div>
    </div>
</template>

<script setup>

import { useToast } from '@/components/ui/toast'

definePageMeta({
    layout: 'admin',
    middleware: 'admin'
})


const { toast } = useToast()

const newClass = ref({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
})

const upcomingClasses = ref([])
const activeLiveClass = ref(null)
const isChatEnabled = ref(false)
const isLiveClassActive = ref(false)

const videoContainer = ref(null)
let agoraClient = null
let localAudioTrack = null
let localVideoTrack = null

const AGORA_APP_ID = '95ef097222fd435d8819aa2ae8ad1870' // Replace with your Agora App ID

onMounted(async () => {
    await fetchUpcomingClasses()
    if (import.meta.client) {
        const AgoraRTC = await import('agora-rtc-sdk-ng')
        agoraClient = AgoraRTC.default.createClient({ mode: 'rtc', codec: 'vp8' })
    }
})

onUnmounted(() => {
    if (import.meta.client) {
        leaveChannel()
    }
})

const fetchUpcomingClasses = async () => {
    try {
        const response = await $fetch('/api/live-classes')
        upcomingClasses.value = response
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to fetch upcoming classes',
        })
    }
}

const scheduleLiveClass = async () => {
    try {
        await $fetch('/api/live-classes', {
            method: 'POST',
            body: newClass.value,
        })
        toast({
            title: 'Success',
            description: 'Live class scheduled successfully',
        })
        await fetchUpcomingClasses()
        newClass.value = { title: '', description: '', startTime: '', endTime: '' }
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to schedule live class',
        })
    }
}

const startLiveClass = async (liveClass) => {
    try {
        const updatedClass = await $fetch(`/api/live-classes/${liveClass.id}`, {
            method: 'PUT',
            body: { status: 'LIVE' },
        })
        activeLiveClass.value = updatedClass
        isLiveClassActive.value = true

        // Initialize Agora client and join channel
        if (import.meta.client) {
            await joinChannel(liveClass.channelName)
        }

        toast({
            title: 'Live Class Started',
            description: 'Your live class has begun. Students can now join.',
        })
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to start live class',
        })
    }
}

const joinChannel = async (channelName) => {
    if (!import.meta.client) return

    try {
        const AgoraRTC = await import('agora-rtc-sdk-ng')
        await agoraClient.join(AGORA_APP_ID, channelName, null, null)
        localAudioTrack = await AgoraRTC.createMicrophoneAudioTrack()
        localVideoTrack = await AgoraRTC.createCameraVideoTrack()
        await agoraClient.publish([localAudioTrack, localVideoTrack])
        localVideoTrack.play(videoContainer.value)
    } catch (error) {
        console.error('Error joining Agora channel:', error)
        toast({
            title: 'Error',
            description: 'Failed to join Agora channel',
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
    if (agoraClient) {
        await agoraClient.leave()
    }
}

const toggleChat = () => {
    isChatEnabled.value = !isChatEnabled.value
    toast({
        title: `Chat ${isChatEnabled.value ? 'Enabled' : 'Disabled'}`,
        description: `Students can ${isChatEnabled.value ? 'now' : 'no longer'} use the chat feature.`,
    })
}

const createPoll = () => {
    // Implement poll creation logic
    toast({
        title: 'Poll Created',
        description: 'A new poll has been created for students to participate.',
    })
}

const endLiveClass = async () => {
    try {
        if (activeLiveClass.value) {
            await $fetch(`/api/live-classes/${activeLiveClass.value.id}`, {
                method: 'PUT',
                body: { status: 'ENDED' },
            })
            // Clean up Agora client and leave channel
            if (import.meta.client) {
                await leaveChannel()
            }
            activeLiveClass.value = null
            isLiveClassActive.value = false
            isChatEnabled.value = false
            await fetchUpcomingClasses()
            toast({
                title: 'Live Class Ended',
                description: 'Your live class has been concluded.',
            })
        }
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to end live class',
        })
    }
}
</script>