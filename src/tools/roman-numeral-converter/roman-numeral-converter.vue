<script setup lang="ts">
import {
  MAX_ARABIC_TO_ROMAN,
  MIN_ARABIC_TO_ROMAN,
  arabicToRoman,
  isValidRomanNumber,
  romanToArabic,
} from './roman-numeral-converter.service';
import { useCopy } from '@/composable/copy';
import { useValidation } from '@/composable/validation';

const inputNumeral = ref(42);
const outputRoman = computed(() => arabicToRoman(inputNumeral.value));
const { t } = useI18n();

const { attrs: validationNumeral } = useValidation<number>({
  source: inputNumeral,
  rules: computed(() => [
    {
      validator: value => value >= MIN_ARABIC_TO_ROMAN && value <= MAX_ARABIC_TO_ROMAN,
      message: t('toolContent.roman.rangeError', { min: MIN_ARABIC_TO_ROMAN.toLocaleString(), max: MAX_ARABIC_TO_ROMAN.toLocaleString() }),
    },
  ]),
});

const inputRoman = ref('XLII');
const outputNumeral = computed(() => romanToArabic(inputRoman.value));

const validationRoman = useValidation<string>({
  source: inputRoman,
  rules: computed(() => [
    {
      validator: value => isValidRomanNumber(value),
      message: t('toolContent.roman.invalidRoman'),
    },
  ]),
});

const { copy: copyRoman } = useCopy({ source: outputRoman, text: () => t('toolContent.roman.romanCopied') });
const { copy: copyArabic } = useCopy({ source: () => String(outputNumeral), text: () => t('toolContent.roman.arabicCopied') });
</script>

<template>
  <div>
    <c-card :title="$t('toolContent.roman.arabicToRoman')">
      <div flex items-center justify-between>
        <n-form-item v-bind="validationNumeral as any">
          <n-input-number v-model:value="inputNumeral" :min="1" style="width: 200px" :show-button="false" />
        </n-form-item>
        <div class="result">
          {{ outputRoman }}
        </div>
        <c-button autofocus :disabled="validationNumeral.validationStatus === 'error'" @click="copyRoman()">
          {{ $t('toolContent.roman.copy') }}
        </c-button>
      </div>
    </c-card>
    <c-card :title="$t('toolContent.roman.romanToArabic')" mt-5>
      <div flex items-center justify-between>
        <c-input-text v-model:value="inputRoman" style="width: 200px" :validation="validationRoman" />

        <div class="result">
          {{ outputNumeral }}
        </div>
        <c-button :disabled="!validationRoman.isValid" @click="copyArabic()">
          {{ $t('toolContent.roman.copy') }}
        </c-button>
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.result {
  font-size: 22px;
}
</style>
