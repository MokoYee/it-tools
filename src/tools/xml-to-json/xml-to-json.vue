<script setup lang="ts">
import convert from 'xml-js';
import { isValidXML } from '../xml-formatter/xml-formatter.service';
import { withDefaultOnError } from '@/utils/defaults';
import type { UseValidationRule } from '@/composable/validation';

const defaultValue = '<a x="1.234" y="It\'s"/>';
const { t } = useI18n();
function transformer(value: string) {
  return withDefaultOnError(() => {
    return JSON.stringify(convert.xml2js(value, { compact: true }), null, 2);
  }, '');
}

const rules = computed<UseValidationRule<string>[]>(() => [
  {
    validator: isValidXML,
    message: t('common.invalidXml'),
  },
]);
</script>

<template>
  <format-transformer
    :input-label="$t('common.yourXmlContent')"
    :input-default="defaultValue"
    :input-placeholder="$t('common.pasteXmlContent')"
    :output-label="$t('common.convertedJson')"
    output-language="json"
    :transformer="transformer"
    :input-validation-rules="rules"
  />
</template>
