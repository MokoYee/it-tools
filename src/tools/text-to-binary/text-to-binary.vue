<script setup lang="ts">
import { convertAsciiBinaryToText, convertTextToAsciiBinary } from './text-to-binary.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';
import { isNotThrowing } from '@/utils/boolean';

const inputText = ref('');
const binaryFromText = computed(() => convertTextToAsciiBinary(inputText.value));
const { copy: copyBinary } = useCopy({ source: binaryFromText });

const inputBinary = ref('');
const textFromBinary = computed(() => withDefaultOnError(() => convertAsciiBinaryToText(inputBinary.value), ''));
const { t } = useI18n();
const inputBinaryValidationRules = computed(() => [
  {
    validator: (value: string) => isNotThrowing(() => convertAsciiBinaryToText(value)),
    message: t('toolContent.binary.invalid'),
  },
]);
const { copy: copyText } = useCopy({ source: textFromBinary });
</script>

<template>
  <c-card :title="$t('toolContent.binary.textToBinary')">
    <c-input-text v-model:value="inputText" multiline :placeholder="$t('toolContent.binary.textPlaceholder')" :label="$t('toolContent.binary.textInputLabel')" autosize autofocus raw-text test-id="text-to-binary-input" />
    <c-input-text v-model:value="binaryFromText" :label="$t('toolContent.binary.binaryOutputLabel')" multiline raw-text readonly mt-2 :placeholder="$t('toolContent.binary.binaryOutputPlaceholder')" test-id="text-to-binary-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!binaryFromText" @click="copyBinary()">
        {{ $t('toolContent.binary.copyBinary') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="$t('toolContent.binary.binaryToText')">
    <c-input-text v-model:value="inputBinary" multiline :placeholder="$t('toolContent.binary.binaryPlaceholder')" :label="$t('toolContent.binary.binaryInputLabel')" autosize raw-text :validation-rules="inputBinaryValidationRules" test-id="binary-to-text-input" />
    <c-input-text v-model:value="textFromBinary" :label="$t('toolContent.binary.textOutputLabel')" multiline raw-text readonly mt-2 :placeholder="$t('toolContent.binary.textOutputPlaceholder')" test-id="binary-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromBinary" @click="copyText()">
        {{ $t('toolContent.binary.copyText') }}
      </c-button>
    </div>
  </c-card>
</template>
