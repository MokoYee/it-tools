<script setup lang="ts">
import { convertTextToUnicode, convertUnicodeToText } from './text-to-unicode.service';
import { useCopy } from '@/composable/copy';

const inputText = ref('');
const unicodeFromText = computed(() => inputText.value.trim() === '' ? '' : convertTextToUnicode(inputText.value));
const { copy: copyUnicode } = useCopy({ source: unicodeFromText });

const inputUnicode = ref('');
const textFromUnicode = computed(() => inputUnicode.value.trim() === '' ? '' : convertUnicodeToText(inputUnicode.value));
const { copy: copyText } = useCopy({ source: textFromUnicode });
</script>

<template>
  <c-card :title="$t('toolContent.unicode.textToUnicode')">
    <c-input-text v-model:value="inputText" multiline :placeholder="$t('toolContent.unicode.textPlaceholder')" :label="$t('toolContent.unicode.textInputLabel')" autosize autofocus raw-text test-id="text-to-unicode-input" />
    <c-input-text v-model:value="unicodeFromText" :label="$t('toolContent.unicode.unicodeOutputLabel')" multiline raw-text readonly mt-2 :placeholder="$t('toolContent.unicode.unicodeOutputPlaceholder')" test-id="text-to-unicode-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!unicodeFromText" @click="copyUnicode()">
        {{ $t('toolContent.unicode.copyUnicode') }}
      </c-button>
    </div>
  </c-card>

  <c-card :title="$t('toolContent.unicode.unicodeToText')">
    <c-input-text v-model:value="inputUnicode" multiline :placeholder="$t('toolContent.unicode.unicodePlaceholder')" :label="$t('toolContent.unicode.unicodeInputLabel')" autosize raw-text test-id="unicode-to-text-input" />
    <c-input-text v-model:value="textFromUnicode" :label="$t('toolContent.unicode.textOutputLabel')" multiline raw-text readonly mt-2 :placeholder="$t('toolContent.unicode.textOutputPlaceholder')" test-id="unicode-to-text-output" />
    <div mt-2 flex justify-center>
      <c-button :disabled="!textFromUnicode" @click="copyText()">
        {{ $t('toolContent.unicode.copyText') }}
      </c-button>
    </div>
  </c-card>
</template>
