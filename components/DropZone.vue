<template>
  <div
    @dragover.prevent
    @drop.prevent="onDrop"
    @click="$refs.fileInput.click()"
    class="cursor-pointer"
  >
    <slot></slot>
    <input
      type="file"
      ref="fileInput"
      @change="onChange"
      accept="image/*"
      multiple
      class="hidden"
    >
  </div>
</template>

<script setup>
const emit = defineEmits(['files-dropped'])

const onDrop = (e) => {
  const files = [...e.dataTransfer.files]
  emit('files-dropped', files)
}

const onChange = (e) => {
  const files = [...e.target.files]
  emit('files-dropped', files)
}
</script>