<script setup lang="ts">
import markdownit from 'markdown-it';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputMarkdown = ref('');
const outputHtml = computed(() => {
  const md = markdownit();
  return md.render(inputMarkdown.value);
});

function printHtml() {
  const w = window.open();
  if (w === null) {
    return;
  }
  w.document.body.innerHTML = outputHtml.value;
  w.print();
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputMarkdown"
      multiline raw-text
      :placeholder="$t('toolContent.markdown.placeholder')"
      rows="8"
      autofocus
      :label="$t('toolContent.markdown.inputLabel')"
    />

    <n-divider />

    <n-form-item :label="$t('toolContent.markdown.outputLabel')">
      <TextareaCopyable :value="outputHtml" :word-wrap="true" language="html" />
    </n-form-item>

    <div flex justify-center>
      <n-button @click="printHtml">
        {{ $t('toolContent.markdown.printPdf') }}
      </n-button>
    </div>
  </div>
</template>
