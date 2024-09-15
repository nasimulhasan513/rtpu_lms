<template>
    <div class="container mx-auto">
        <div class="grid grid-cols-12 gap-6">
            <div class="col-span-3 lg:col-span-2">
                <!-- Image Thumbnails Sidebar -->
                <div class="p-4 bg-white rounded-lg shadow-md">
                    <div class="space-y-2">
                        <div v-for="(image, index) in submissionImages" :key="index" class="relative cursor-pointer"
                            @click="selectImage(index)">
                            <img :src="image" class="object-cover w-full rounded shadow-sm"
                                :class="{ 'border-2 border-primary': selectedImage === index }" />
                            <div
                                class="absolute top-0 right-0 flex items-center justify-center w-6 h-6 text-xs text-white rounded-full bg-primary">
                                {{ index + 1 }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="col-span-9 lg:col-span-7">
                <!-- Image viewer and annotation tools -->
                <div class="p-4 mb-6 bg-white rounded-lg shadow-md">

                    <!-- Annotation tools -->
                    <div class="p-4 mb-4 bg-gray-100 rounded-lg">
                        <div class="flex flex-wrap items-center gap-4">
                            <div class="flex items-center space-x-2">
                                <Button @click="startAnnotation" variant="outline" class="flex items-center">
                                    <Icon name="lucide:refresh-cw" class="w-4 h-4 mr-2" />
                                    Reset
                                </Button>
                                <Button @click="saveAnnotation" variant="default" class="flex items-center">
                                    <Icon name="lucide:save" class="w-4 h-4 mr-2" />
                                    Save
                                </Button>
                            </div>

                            <Separator orientation="vertical" class="h-8" />
                            <div class="flex items-center space-x-2">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="outline" class="w-10 h-10 p-0">
                                            <span class="sr-only">Open color picker</span>
                                            <span class="block w-6 h-6 rounded-full"
                                                :style="{ backgroundColor: annotationColor }"></span>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent class="w-56">
                                        <DropdownMenuLabel>Choose a color</DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <div class="grid grid-cols-5 gap-2 p-2">
                                            <button v-for="color in colors" :key="color"
                                                @click="annotationColor = color"
                                                class="w-8 h-8 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                                                :style="{ backgroundColor: color }"></button>
                                        </div>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                            <div class="flex items-center space-x-2">
                                <ToggleGroup type="single" v-model="currentTool" variant="outline">
                                    <ToggleGroupItem value="pen" aria-label="Toggle pen">
                                        <Icon name="lucide:pen" class="w-4 h-4" />
                                    </ToggleGroupItem>
                                    <ToggleGroupItem value="eraser" aria-label="Toggle eraser">
                                        <Icon name="lucide:eraser" class="w-4 h-4" />
                                    </ToggleGroupItem>
                                </ToggleGroup>
                            </div>

                            <Separator orientation="vertical" class="h-8" />

                            <div class="flex items-center flex-grow space-x-2">
                                <Label for="lineWidth" class="text-sm font-medium">Line Width:</Label>
                                <Slider id="lineWidth" v-model="lineWidth" :min="1" :max="20" :step="1" class="w-40" />
                                <span class="w-8 text-sm">{{ lineWidth }}</span>
                            </div>

                            <Separator orientation="vertical" class="h-8" />


                        </div>
                    </div>

                    <div v-if="selectedImage !== null" class="relative flex items-center justify-center">
                        <canvas ref="annotationCanvas" class="border border-gray-300 rounded shadow-lg"
                            @mousedown="startDrawing" @mousemove="draw" @mouseup="stopDrawing"
                            @mouseleave="stopDrawing"></canvas>
                    </div>
                </div>
            </div>

            <div class="col-span-12 lg:col-span-3">
                <!-- Evaluation form -->
                <div class="p-4 bg-white rounded-lg shadow-md">
                    <h2 class="mb-4 text-xl font-semibold">Evaluation Form</h2>
                    <form @submit.prevent="submitEvaluation" class="space-y-4">
                        <div>
                            <Label for="grade">Grade</Label>
                            <Input id="grade" v-model="grade" type="number" required class="border-gray-300 rounded" />
                        </div>
                        <div>
                            <Label for="feedback">Feedback</Label>
                            <Textarea id="feedback" v-model="feedback" required rows="6"
                                class="border-gray-300 rounded" />
                        </div>
                        <Button type="submit" class="w-full">Submit Evaluation</Button>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { useToast } from "@/components/ui/toast";
import { ref, onMounted, watch, computed } from 'vue';
import { useCloudflareImage } from '@/composables/useCloudflareImage';

definePageMeta({
    layout: 'blank',
});

const route = useRoute();
const router = useRouter();
const { toast } = useToast();
const { uploadImage } = useCloudflareImage();

const assignmentId = route.params.id as string;
const submissionId = route.params.submissionId as string;

const { data: submission, error } = await useFetch(`/api/admin/assignments/${assignmentId}/submissions/${submissionId}`);

if (error.value) {
    toast({
        title: 'Error',
        description: 'Failed to fetch submission details',
        variant: 'destructive',
    });
}

const grade = ref<number | null>(null);
const feedback = ref('');
const submissionImages = ref<string[]>([]);
const selectedImage = ref<number | null>(null);

const originalImageSize = ref({ width: 0, height: 0 });
const scale = ref(1);
const canvasWidth = ref(0);
const canvasHeight = ref(0);

const annotationCanvas = ref<HTMLCanvasElement | null>(null);
const ctx = ref<CanvasRenderingContext2D | null>(null);
const isDrawing = ref(false);

const colors = ['white', 'red', 'blue', 'green', 'yellow', 'black', 'purple', 'orange', 'pink', , 'gray'];
const annotationColor = ref('red');
const lineWidth = ref([2]);
const isEraser = ref(false);

const loadImage = (src: string): Promise<HTMLImageElement> => {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
    });
};

const toggleEraser = () => {
    isEraser.value = !isEraser.value;
};

const loadImageOnCanvas = async (index: number) => {
    if (!annotationCanvas.value) return;

    const canvas = annotationCanvas.value;
    ctx.value = canvas.getContext('2d');

    try {
        const img = await loadImage(submissionImages.value[index]);
        originalImageSize.value = { width: img.width, height: img.height };

        const containerWidth = canvas.parentElement?.clientWidth || 800;
        const containerHeight = window.innerHeight; // 80% of viewport height

        scale.value = Math.min(containerWidth / img.width, containerHeight / img.height);

        canvasWidth.value = img.width;
        canvasHeight.value = img.height;
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.style.width = `${img.width * scale.value}px`;
        canvas.style.height = `${img.height * scale.value}px`;

        if (ctx.value) {
            ctx.value.clearRect(0, 0, canvas.width, canvas.height);
            ctx.value.drawImage(img, 0, 0, img.width, img.height);
        }
    } catch (error) {
        console.error('Error loading image:', error);
        toast({
            title: 'Error',
            description: 'Failed to load image for annotation',
            variant: 'destructive',
        });
    }
};

const getMousePos = (canvas: HTMLCanvasElement, evt: MouseEvent) => {
    const rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / scale.value,
        y: (evt.clientY - rect.top) / scale.value
    };
};

const selectImage = (index: number) => {
    selectedImage.value = index;
    loadImageOnCanvas(index);
};

const startAnnotation = () => {
    if (selectedImage.value !== null) {
        loadImageOnCanvas(selectedImage.value);
    }
};

const startDrawing = (event: MouseEvent) => {
    isDrawing.value = true;
    if (ctx.value && annotationCanvas.value) {
        const pos = getMousePos(annotationCanvas.value, event);
        ctx.value.beginPath();
        ctx.value.moveTo(pos.x, pos.y);
    }
};

const draw = (event: MouseEvent) => {
    if (!isDrawing.value || !ctx.value || !annotationCanvas.value) return;
    const pos = getMousePos(annotationCanvas.value, event);

    ctx.value.lineCap = 'round';
    ctx.value.lineJoin = 'round';

    if (isEraser.value) {
        ctx.value.globalCompositeOperation = 'destination-out';
        ctx.value.strokeStyle = 'rgba(255,255,255,1)';
    } else {
        ctx.value.globalCompositeOperation = 'source-over';
        ctx.value.strokeStyle = annotationColor.value;
    }

    ctx.value.lineWidth = lineWidth.value[0];
    ctx.value.lineTo(pos.x, pos.y);
    ctx.value.stroke();
    ctx.value.beginPath();
    ctx.value.moveTo(pos.x, pos.y);
};

const stopDrawing = () => {
    isDrawing.value = false;
    if (ctx.value) {
        ctx.value.beginPath();
    }
};

const saveAnnotation = async () => {
    if (!annotationCanvas.value) return;

    const canvas = annotationCanvas.value;
    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, 'image/png', 0.95));
    if (!blob) return;

    const uploadedUrl = await uploadImage(blob, `annotated_${submissionId}_${selectedImage.value}`);

    submissionImages.value[selectedImage.value] = uploadedUrl;

    toast({
        title: 'Success',
        description: 'Annotation saved successfully',
    });
};

onMounted(() => {
    if (submission.value?.content) {
        submissionImages.value = JSON.parse(submission.value.content);
        if (submissionImages.value.length > 0) {
            selectImage(0);
        }
    }
    window.addEventListener('resize', () => {
        if (selectedImage.value !== null) {
            loadImageOnCanvas(selectedImage.value);
        }
    });
});

watch(selectedImage, (newValue) => {
    if (newValue !== null) {
        loadImageOnCanvas(newValue);
    }
});

const submitEvaluation = async () => {
    try {
        await $fetch(`/api/admin/assignments/${assignmentId}/submissions/${submissionId}/evaluate`, {
            method: 'POST',
            body: {
                grade: grade.value,
                feedback: feedback.value,
                annotatedImages: submissionImages.value,
            },
        });
        toast({
            title: 'Success',
            description: 'Evaluation submitted successfully',
        });
        router.push(`/admin/assignments/${assignmentId}/submissions`);
    } catch (error) {
        toast({
            title: 'Error',
            description: 'Failed to submit evaluation',
            variant: 'destructive',
        });
    }
};
</script>

<style scoped>
canvas {
    width: 100%;
    height: auto;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
