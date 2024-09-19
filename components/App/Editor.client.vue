<template>
    <div class="flex flex-col justify-start border">
        <p class="text-sm text-gray-500">Description</p>
        <div class="flex flex-col p-2 bg-white border rounded-md " id="editorjs" ref="htmlelement"></div>
    </div>
  </template>
  <script setup>
  import EditorJS from '@editorjs/editorjs';

  import { onMounted, onUnmounted, ref, watch } from 'vue';
  
  const htmlelement = ref(null);
  
  const props = defineProps(['modelValue', 'placeholder'])
  const emit = defineEmits(['update:modelValue'])
  
  
  let editor;
  let updatingModel = false;
  
  // model -> view
  function modelToView() {
    if (!props.modelValue) { return; }
    if (typeof props.modelValue === 'string') {
      editor.blocks.renderFromHTML(props.modelValue);
      return;
    }
  
    editor.render(props.modelValue);
  }
  
  // view -> model
  function viewToModel(api, event) {
    updatingModel = true;
  
    editor.save().then((outputData) => {
      emit('update:modelValue', outputData);
    }).catch((error) => {
      console.log(event, 'Saving failed: ', error)
    }).finally(() => {
      updatingModel = false;
    })
  }
  
  onMounted(() => {
    editor = new EditorJS({
      holder: 'editorjs',
      placeholder: props.placeholder,
      inlineToolbar: ['bold', 'italic', 'link'],
      minHeight: 'auto',
      minWidth: 'w-full',
      data: props.modelValue,
      onReady: modelToView,
      onChange: viewToModel,
    })
  })
  
  watch(() => props.modelValue, () => {
    if (!updatingModel) {
      modelToView()
    }
  })
  
 
  </script>