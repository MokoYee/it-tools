<script setup lang="ts">
import { parse as parseYaml } from 'yaml';
import type { UseValidationRule } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const { t } = useI18n();

function transformer(value: string) {
  return withDefaultOnError(() => {
    const obj = parseYaml(value, { merge: true });
    return obj ? JSON.stringify(obj, null, 3) : '';
  }, '');
}

const rules = computed<UseValidationRule<string>[]>(() => [
  {
    validator: (value: string) => isNotThrowing(() => parseYaml(value)),
    message: t('common.invalidYaml'),
  },
]);
</script>

<template>
  <format-transformer
    :input-label="$t('common.yourYaml')"
    :input-placeholder="$t('common.pasteYaml')"
    :output-label="$t('common.jsonFromYaml')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
