<script setup lang="ts">
import { extractJsonPath } from './jsonpath-extractor.service';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

interface JsonPathExample {
  key: 'basic' | 'filter' | 'recursive'
  path: string
  json: string
}

interface InputTextExpose {
  inputWrapperRef?: HTMLElement
}

const { t } = useI18n();

const examples: JsonPathExample[] = [
  {
    key: 'basic',
    path: '$.data[*].a',
    json: JSON.stringify({ data: [{ a: '1' }, { a: '2' }] }, null, 2),
  },
  {
    key: 'filter',
    path: '$.orders[?(@.status == "paid" && @.total >= 300)].id',
    json: JSON.stringify({
      orders: [
        { id: 'A-1001', status: 'paid', total: 268 },
        { id: 'A-1002', status: 'pending', total: 88 },
        { id: 'A-1003', status: 'paid', total: 520 },
      ],
    }, null, 2),
  },
  {
    key: 'recursive',
    path: '$..email',
    json: JSON.stringify({
      company: {
        departments: [
          {
            name: 'Engineering',
            members: [
              { name: 'Alice', email: 'alice@example.com' },
              { name: 'Bob', contact: { email: 'bob@example.com' } },
            ],
          },
        ],
        support: { email: 'support@example.com' },
      },
    }, null, 2),
  },
];

const jsonInputElement = ref<InputTextExpose>();
const jsonInput = ref(examples[0].json);
const jsonPath = ref(examples[0].path);
const extraction = computed(() => extractJsonPath(jsonInput.value, jsonPath.value));

const jsonError = computed(() => {
  if (extraction.value.ok || !['EMPTY_JSON', 'INVALID_JSON'].includes(extraction.value.code)) {
    return '';
  }

  return t(`tools.jsonpath-extractor.errors.${extraction.value.code.toLowerCase()}`);
});

const pathError = computed(() => {
  if (extraction.value.ok || !['EMPTY_PATH', 'INVALID_PATH'].includes(extraction.value.code)) {
    return '';
  }

  return t(`tools.jsonpath-extractor.errors.${extraction.value.code.toLowerCase()}`);
});

const output = computed(() => extraction.value.ok ? extraction.value.output : '');
const matchCount = computed(() => extraction.value.ok ? extraction.value.matches.length : 0);
const outputLabel = computed(() => t('tools.jsonpath-extractor.outputLabel', { count: matchCount.value }));

function loadExample(example: JsonPathExample) {
  jsonInput.value = example.json;
  jsonPath.value = example.path;
}
</script>

<template>
  <n-form-item
    :label="t('tools.jsonpath-extractor.pathLabel')"
    :feedback="pathError"
    :validation-status="pathError ? 'error' : undefined"
  >
    <c-input-text
      v-model:value="jsonPath"
      :placeholder="t('tools.jsonpath-extractor.pathPlaceholder')"
      test-id="jsonpath-input"
      raw-text
      monospace
      clearable
      autofocus
    />
  </n-form-item>

  <div mb-4 flex flex-wrap items-center gap-2>
    <span text-sm op-70>{{ t('tools.jsonpath-extractor.examplesLabel') }}</span>
    <c-button
      v-for="example in examples"
      :key="example.key"
      size="small"
      :data-test-id="`example-${example.key}`"
      @click="loadExample(example)"
    >
      {{ t(`tools.jsonpath-extractor.examples.${example.key}`) }}
    </c-button>
  </div>

  <n-grid cols="1 900:2" x-gap="16" y-gap="16">
    <n-gi>
      <n-form-item
        :label="t('tools.jsonpath-extractor.inputLabel')"
        :feedback="jsonError"
        :validation-status="jsonError ? 'error' : undefined"
      >
        <c-input-text
          ref="jsonInputElement"
          v-model:value="jsonInput"
          :placeholder="t('tools.jsonpath-extractor.inputPlaceholder')"
          rows="20"
          multiline
          raw-text
          monospace
          test-id="json-input"
        />
      </n-form-item>
    </n-gi>

    <n-gi>
      <n-form-item :label="outputLabel">
        <TextareaCopyable
          :value="output"
          language="json"
          :copy-message="t('tools.jsonpath-extractor.copyResult')"
          :follow-height-of="jsonInputElement?.inputWrapperRef"
        />
      </n-form-item>
    </n-gi>
  </n-grid>
</template>
