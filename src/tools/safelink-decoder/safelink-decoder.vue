<script setup lang="ts">
import { decodeSafeLinksURL } from './safelink-decoder.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

const inputSafeLinkUrl = ref('');
const { t } = useI18n();
const outputDecodedUrl = computed(() => {
  try {
    return decodeSafeLinksURL(inputSafeLinkUrl.value) ?? '';
  }
  catch (e: any) {
    return t('toolContent.safelink.invalid');
  }
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="inputSafeLinkUrl"
      raw-text
      :placeholder="$t('toolContent.safelink.placeholder')"
      autofocus
      :label="$t('toolContent.safelink.inputLabel')"
    />

    <n-divider />

    <n-form-item :label="$t('toolContent.safelink.outputLabel')">
      <TextareaCopyable :value="outputDecodedUrl" :word-wrap="true" />
    </n-form-item>
  </div>
</template>
