<template>
    <AppModal size="sm:min-w-3xl" :isOpen="isOpen" title="Question Management"
      description="Create and update question for an exam" @onClose="onClose" v-if="isOpen">
  
      <form @submit.prevent="onSubmit">
        <div class="space-y-6">
          <div class="grid grid-cols-2 gap-6">
            <!-- Subject Select -->
            <Select v-model="model.subjectId">
              <SelectTrigger>
                <SelectValue placeholder="Select subject" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup v-for="s in subjects" :key="s.id">
                  <SelectItem :value="s.id">
                    {{ s.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
  
            <!-- Chapter Select -->
            <Select v-model="model.chapterId">
              <SelectTrigger>
                <SelectValue placeholder="Select chapter" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup v-for="c in chapters" :key="c.id">
                  <SelectItem :value="c.id">
                    {{ c.name }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
        </div>
  
        <!-- Question Input -->
        <div class="flex flex-wrap my-6 -mx-3">
          <div class="w-full px-3 mb-6 md:mb-0">
            <div class="flex items-center justify-between">
              <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase" for="grid-question">
                Question
              </label>
              <div class="inline-flex items-center space-x-2">
                <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase" for="grid-question">
                  Rich Text
                </label>
                <input type="checkbox" class="-mt-2 checkbox checkbox-primary" v-model="richText.question">
              </div>
            </div>
  
            <Textarea v-if="!richText.question" v-model="model.question" placeholder="Question" />
            <div v-else>
              <QuillEditor v-model:content="model.question" contentType="html" :options="editorOptions" />
            </div>
          </div>
        </div>
  
        <!-- Options Management -->
        <Tabs default-value="text">
          <TabsList class="grid w-full grid-cols-1">
            <TabsTrigger value="text">Text Based</TabsTrigger>
            <!-- <TabsTrigger value="easy">Option Based</TabsTrigger> -->
          </TabsList>
  
          <TabsContent value="easy">
            <div class="grid gap-6 my-6">
              <!-- Option Label Group -->
              <div v-for="(labelGroup, key) in optionLabels" :key="key" class="grid grid-cols-4 gap-4">
                <Button v-for="(label, index) in labelGroup" :key="index" @click.prevent="setOptions(key, label)"
                  :variant="model.options[index].correct && model.options[index].option_text === label ? '' : 'outline'">
                  {{ label }}
                </Button>
              </div>
            </div>
          </TabsContent>
  
          <!-- Dynamic Option Input for Text -->
          <TabsContent value="text">
            <div class="space-y-3">
              <template v-for="(option, index) in model.options" :key="index">
                <div class="w-full p-1 space-y-2">
                  <div class="flex items-center justify-between">
                    <div class="flex gap-2">
                      <Checkbox @update:checked="option.correct = !option.correct" :checked="option.correct" />
                      <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                        Option {{ getOptionLabel(index) }}
                      </label>
                    </div>
  
                    <div class="flex gap-2">
                      <Checkbox @update:checked="richText[index] = !richText[index]" />
                      <label class="block mb-2 text-xs font-bold tracking-wide text-gray-700 uppercase">
                        Rich Text
                      </label>
                    </div>
                  </div>
  
                  <!-- Option Text or Rich Editor -->
                  <Input v-if="!richText[index]" v-model="option.option_text" placeholder="Answer" />
                  <div v-else>
                    <QuillEditor v-model:content="option.option_text" contentType="html" :options="editorOptions" />
                  </div>
  
                  <!-- Remove Option Button -->
                  <div class="flex justify-end">
                    <Button variant="ghost" @click.prevent="removeOption(index)" class="text-sm text-red-500">
                    Remove Option
                  </Button>
                  </div>
                </div>
              </template>
            </div>
  
            <!-- Add Option Button -->
            <div class="flex justify-end">
                <Button variant="outline" @click.prevent="addOption" class="mt-2 text-blue-500">
                    <Icon name="lucide:plus" class="w-4 h-4 mr-2" />
              Add Option
            </Button>
            </div>
          </TabsContent>
        </Tabs>
  
        <!-- Explanation Input -->
        <div>
          <Label>Explanation</Label>
          <QuillEditor v-model:content="model.explain" contentType="html" :options="editorOptions" />
        </div>
  
        <!-- Save Button -->
        <div class="flex justify-center gap-3 py-2 my-3 text-center">
          <AppButton :loading="loading" @click="onSubmit" label="Save MCQ" :loadingLabel="'Please wait...'" />
        </div>
      </form>
  
    </AppModal>
  </template>
  
  <script setup>
  import { useToast } from '@/components/ui/toast/use-toast'
  import { questionSchema } from '@/schema/question.schema';
  import '@vueup/vue-quill/dist/vue-quill.snow.css';
  import { z } from 'zod';
  const props = defineProps({

label: {
    type: String,
    default: 'Create MCQ'
},
isEdit: {
    type: Boolean,
    default: false
}
})
  const { QuillEditor } = await import('@vueup/vue-quill');
  const { onClose, isOpen, initialQuestion, examId } = useQuestion();
  
  const { subjects } = useSubject()

const chapters = ref([])
  
  const optionLabels = {
    'en': ['A', 'B', 'C', 'D'],
    'bn': ['ক', 'খ', 'গ', 'ঘ'],
    'mul': ['i, ii', 'ii, iii', 'i, iii', 'i, ii, iii']
  };
  
  const model = ref({
    question: '',
    examId: examId.value,
    options: [
      { option_text: '', correct: false },
      { option_text: '', correct: false },
      { option_text: '', correct: false },
      { option_text: '', correct: false }
    ],
    subjectId: '',
    chapterId: '',
    difficulty: 'Medium',
    explain: ''
  });
  
  const richText = ref({ question: false });
  const loading = ref(false);
  
  const addOption = () => {
    model.value.options.push({ option_text: '', correct: false });
  };
  
  const removeOption = (index) => {
    model.value.options.splice(index, 1);
  };
  
  const getOptionLabel = (index) => {
    const optionLabels = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    return optionLabels[index] || `Option ${index + 1}`;
  };
  
  const setOptions = (lang, value) => {
    model.value.options.forEach((option, i) => {
      option.option_text = optionLabels[lang][i] || '';
      option.correct = option.option_text === value;
    });
  };
  const {toast} = useToast()
  const onSubmit = async () => {
    loading.value = true;
    try {
      
      if (initialQuestion.value?.id) {
        await $fetch(`/api/admin/questions/${model.value.id}`, { method: 'PUT', body: model.value });
      } else {
        const validatedData = questionSchema.parse(model.value);
        await $fetch('/api/admin/questions', { method: 'POST', body: validatedData });
      }
      refreshNuxtData('exam-questions')
      onClose();
    } catch (error) {
        console.log(error)
      if (error instanceof z.ZodError) {
        toast({ title: 'Validation Error', description: error.errors[0].message });
      } else {
        toast({ title: 'Something went wrong', description: error.response?.data?.message || 'Unexpected error' });
      }
    } finally {
      loading.value = false;
    }
  };
  
  watch(() => model.value.subjectId, (subjectId) => {
    if (subjectId) {
      const selectedSubject = subjects.value.find((s) => s.id === subjectId);
      chapters.value = selectedSubject ? selectedSubject.chapters : [];
    }
  });
  
  watch(initialQuestion, (value) => {
    if (value) {
      model.value = {
        ...value,
        options: value.options.map((o) => ({ ...o }))
      };
    }
  });
  </script>
  
  <style scoped>
  /* Add your styles here */
  </style>
  