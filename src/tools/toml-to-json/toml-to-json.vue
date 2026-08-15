<script setup lang="ts">
import { parse as parseToml } from 'iarna-toml-esm';
import { withDefaultOnError } from '../../utils/defaults';
import { isValidToml } from './toml.services';
import type { UseValidationRule } from '@/composable/validation';

const transformer = (value: string) => value === '' ? '' : withDefaultOnError(() => JSON.stringify(parseToml(value), null, 3), '');
const { t } = useI18n();

const rules = computed<UseValidationRule<string>[]>(() => [
  {
    validator: isValidToml,
    message: t('common.invalidToml'),
  },
]);
</script>

<template>
  <format-transformer
    :input-label="$t('common.yourToml')"
    :input-placeholder="$t('common.pasteToml')"
    :output-label="$t('common.jsonFromToml')"
    output-language="json"
    :input-validation-rules="rules"
    :transformer="transformer"
  />
</template>
