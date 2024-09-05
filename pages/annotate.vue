<template>
    <div>
        <div class="toolbar">
            <label>
                Color:
                <input type="color" v-model="strokeColor" />
            </label>
            <label>
                Stroke Width:
                <input type="range" v-model="strokeWidth" min="1" max="20" />
            </label>
            <button @click="toggleEraser">{{ eraserMode ? 'Disable Eraser' : 'Enable Eraser' }}</button>
            <button @click="saveAnnotation">Save Annotation</button>
        </div>
        <canvas ref="canvas" :width="imageWidth" :height="imageHeight" @mousedown="startDrawing" @mouseup="stopDrawing"
            @mousemove="draw" @touchstart="startDrawing" @touchend="stopDrawing" @touchmove="draw"></canvas>
    </div>
</template>

<script setup>
definePageMeta({
    title: 'Annotate Image',
    description: 'Annotate image using canvas',
    layout: 'blank'
});

const canvas = ref(null);
const ctx = ref(null);
const imageWidth = ref(800);
const imageHeight = ref(600);
let isDrawing = false;
let eraserMode = ref(false);

const strokeColor = ref('#ff0000'); // Default color red
const strokeWidth = ref(5); // Default stroke width

onMounted(() => {
    const canvasElement = canvas.value;
    ctx.value = canvasElement.getContext('2d');

    const img = new Image();
    img.src = 'https://storage.rhombuspublications.com/cover/zyddbye8foxvrqc0pgos.jpg';
    img.onload = () => {
        ctx.value.drawImage(img, 0, 0, imageWidth.value, imageHeight.value);
    };
});

const startDrawing = (e) => {
    isDrawing = true;
    draw(e); // To avoid a gap between touchstart/mousedown and the first move
};

const stopDrawing = () => {
    isDrawing = false;
    ctx.value.beginPath();
};

const draw = (e) => {
    if (!isDrawing) return;

    e.preventDefault(); // Prevent scrolling when drawing on a touch device

    const canvasElement = canvas.value;
    let clientX, clientY;

    if (e.touches) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }

    if (eraserMode.value) {
        ctx.value.strokeStyle = '#ffffff'; // Assuming white background for eraser
        ctx.value.lineWidth = 20; // Eraser width can be fixed or adjustable
    } else {
        ctx.value.strokeStyle = strokeColor.value;
        ctx.value.lineWidth = strokeWidth.value;
    }

    ctx.value.lineCap = 'round';

    ctx.value.lineTo(clientX - canvasElement.offsetLeft, clientY - canvasElement.offsetTop);
    ctx.value.stroke();
    ctx.value.beginPath();
    ctx.value.moveTo(clientX - canvasElement.offsetLeft, clientY - canvasElement.offsetTop);
};

const toggleEraser = () => {
    eraserMode.value = !eraserMode.value;
};

const saveAnnotation = () => {
    const dataURL = canvas.value.toDataURL('image/png');
    const link = document.createElement('a');
    link.href = dataURL;
    link.download = 'annotated_image.png';
    link.click();
};
</script>

<style scoped>
.toolbar {
    margin-bottom: 10px;
}

.toolbar label {
    margin-right: 15px;
}
</style>
