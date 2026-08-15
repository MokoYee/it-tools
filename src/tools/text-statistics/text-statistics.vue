<script setup lang="ts">
import { getStringSizeInBytes } from './text-statistics.service';
import { formatBytes } from '@/utils/convert';

const text = ref('');
</script>

<template>
  <c-card>
    <c-input-text v-model:value="text" multiline :placeholder="$t('toolContent.textStatistics.placeholder')" rows="5" />

    <div mt-5 flex>
      <n-statistic :label="$t('toolContent.textStatistics.characters')" :value="text.length" flex-1 />
      <n-statistic :label="$t('toolContent.textStatistics.words')" :value="text === '' ? 0 : text.split(/\s+/).length" flex-1 />
      <n-statistic :label="$t('toolContent.textStatistics.lines')" :value="text === '' ? 0 : text.split(/\r\n|\r|\n/).length" flex-1 />
      <n-statistic :label="$t('toolContent.textStatistics.bytes')" :value="formatBytes(getStringSizeInBytes(text))" flex-1 />
    </div>
  </c-card>
</template>
