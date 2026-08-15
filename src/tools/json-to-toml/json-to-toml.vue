<script setup lang="ts">
import { stringify as stringifyToml } from 'iarna-toml-esm';
import JSON5 from 'json5';
import { withDefaultOnError } from '../../utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const convertJsonToToml = (value: string) => [stringifyToml(JSON5.parse(value))].flat().join('\n').trim();

const transformer = (value: string) => value.trim() === '' ? '' : withDefaultOnError(() => convertJsonToToml(value), '');
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
    :input-label="$t('common.yourJson')"
    :input-placeholder="$t('common.pasteJson')"
    :output-label="$t('common.tomlFromJson')"
    output-language="toml"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
