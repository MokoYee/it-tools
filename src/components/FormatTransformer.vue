<script setup lang="ts">
import _ from 'lodash';
import type { UseValidationRule } from '@/composable/validation';
import CInputText from '@/ui/c-input-text/c-input-text.vue';

const props = withDefaults(
  defineProps<{
    transformer?: (v: string) => string
    inputValidationRules?: UseValidationRule<string>[]
    inputLabel?: string
    inputPlaceholder?: string
    inputDefault?: string
    outputLabel?: string
    outputLanguage?: string
  }>(),
  {
    transformer: _.identity,
    inputValidationRules: () => [],
    inputLabel: undefined,
    inputDefault: '',
    inputPlaceholder: undefined,
    outputLabel: undefined,
    outputLanguage: '',
  },
);

const { transformer, inputValidationRules, inputLabel, outputLabel, outputLanguage, inputPlaceholder, inputDefault }
  = toRefs(props);

const inputElement = ref<typeof CInputText>();
const { t } = useI18n();
const effectiveInputLabel = computed(() => inputLabel.value ?? t('common.input'));
const effectiveInputPlaceholder = computed(() => inputPlaceholder.value ?? t('common.inputPlaceholder'));
const effectiveOutputLabel = computed(() => outputLabel.value ?? t('common.output'));

const input = ref(inputDefault.value);
const output = computed(() => transformer.value(input.value));
</script>

<template>
  <CInputText
    ref="inputElement"
    v-model:value="input"
    :placeholder="effectiveInputPlaceholder"
    :label="effectiveInputLabel"
    rows="20"
    autosize
    raw-text
    multiline
    test-id="input"
    :validation-rules="inputValidationRules"
    monospace
  />

  <div overflow-auto>
    <div mb-5px>
      {{ effectiveOutputLabel }}
    </div>
    <textarea-copyable :value="output" :language="outputLanguage" :follow-height-of="inputElement?.inputWrapperRef" />
  </div>
</template>
