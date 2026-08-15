<script setup lang="ts">
import { textToNatoAlphabet } from './text-to-nato-alphabet.service';
import { useCopy } from '@/composable/copy';

const input = ref('');
const natoText = computed(() => textToNatoAlphabet({ text: input.value }));
const { t } = useI18n();
const { copy } = useCopy({ source: natoText, text: () => t('toolContent.nato.copied') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="input"
      :label="$t('toolContent.nato.inputLabel')"
      :placeholder="$t('toolContent.nato.placeholder')"
      clearable
      mb-5
    />

    <div v-if="natoText">
      <div mb-2>
        {{ $t('toolContent.nato.outputLabel') }}
      </div>
      <c-card>
        {{ natoText }}
      </c-card>

      <div mt-3 flex justify-center>
        <c-button autofocus @click="copy()">
          {{ $t('toolContent.nato.copy') }}
        </c-button>
      </div>
    </div>
  </div>
</template>
