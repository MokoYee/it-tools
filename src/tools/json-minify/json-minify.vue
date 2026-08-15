<script setup lang="ts">
import JSON5 from 'json5';
import type { UseValidationRule } from '@/composable/validation';
import { withDefaultOnError } from '@/utils/defaults';

const defaultValue = '{\n\t"hello": [\n\t\t"world"\n\t]\n}';
const transformer = (value: string) => withDefaultOnError(() => JSON.stringify(JSON5.parse(value), null, 0), '');
const { t } = useI18n();

const rules = computed<UseValidationRule<string>[]>(() => [
  {
    validator: (v: string) => v === '' || JSON5.parse(v),
    message: t('common.invalidJson'),
  },
]);
</script>

<template>
  <format-transformer
    :input-label="$t('common.rawJson')"
    :input-default="defaultValue"
    :input-placeholder="$t('common.pasteRawJson')"
    :output-label="$t('common.minifiedJson')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
