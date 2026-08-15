<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const encodeInput = ref('Hello world :)');
const encodeOutput = computed(() => withDefaultOnError(() => encodeURIComponent(encodeInput.value), ''));
const { t } = useI18n();

const encodedValidation = useValidation<string>({
  source: encodeInput,
  rules: computed(() => [
    {
      validator: value => isNotThrowing(() => encodeURIComponent(value)),
      message: t('toolContent.urlEncoder.parseError'),
    },
  ]),
});

const { copy: copyEncoded } = useCopy({ source: encodeOutput, text: () => t('toolContent.urlEncoder.encodedCopied') });

const decodeInput = ref('Hello%20world%20%3A)');
const decodeOutput = computed(() => withDefaultOnError(() => decodeURIComponent(decodeInput.value), ''));

const decodeValidation = useValidation<string>({
  source: decodeInput,
  rules: computed(() => [
    {
      validator: value => isNotThrowing(() => decodeURIComponent(value)),
      message: t('toolContent.urlEncoder.parseError'),
    },
  ]),
});

const { copy: copyDecoded } = useCopy({ source: decodeOutput, text: () => t('toolContent.urlEncoder.decodedCopied') });
</script>

<template>
  <c-card :title="$t('toolContent.urlEncoder.encode')">
    <c-input-text
      v-model:value="encodeInput"
      :label="$t('toolContent.urlEncoder.inputLabel')"
      :validation="encodedValidation"
      multiline
      autosize
      :placeholder="$t('toolContent.urlEncoder.encodePlaceholder')"
      rows="2"
      mb-3
    />

    <c-input-text
      :label="$t('toolContent.urlEncoder.encodedLabel')"
      :value="encodeOutput"
      multiline
      autosize
      readonly
      :placeholder="$t('toolContent.urlEncoder.encodedPlaceholder')"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyEncoded()">
        {{ $t('toolContent.urlEncoder.copy') }}
      </c-button>
    </div>
  </c-card>
  <c-card :title="$t('toolContent.urlEncoder.decode')">
    <c-input-text
      v-model:value="decodeInput"
      :label="$t('toolContent.urlEncoder.encodedInputLabel')"
      :validation="decodeValidation"
      multiline
      autosize
      :placeholder="$t('toolContent.urlEncoder.decodePlaceholder')"
      rows="2"
      mb-3
    />

    <c-input-text
      :label="$t('toolContent.urlEncoder.decodedLabel')"
      :value="decodeOutput"
      multiline
      autosize
      readonly
      :placeholder="$t('toolContent.urlEncoder.decodedPlaceholder')"
      rows="2"
      mb-3
    />

    <div flex justify-center>
      <c-button @click="copyDecoded()">
        {{ $t('toolContent.urlEncoder.copy') }}
      </c-button>
    </div>
  </c-card>
</template>
