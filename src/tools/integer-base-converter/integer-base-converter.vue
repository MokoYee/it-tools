<script setup lang="ts">
import InputCopyable from '../../components/InputCopyable.vue';
import { InvalidBaseDigitError, convertBase } from './integer-base-converter.model';

const inputProps = {
  'labelPosition': 'left',
  'labelWidth': '170px',
  'labelAlign': 'right',
  'readonly': true,
  'mb-2': '',
} as const;

const input = ref('42');
const inputBase = ref(10);
const outputBase = ref(42);
const { t } = useI18n();

function errorlessConvert(...args: Parameters<typeof convertBase>) {
  try {
    return convertBase(...args);
  }
  catch (err) {
    return '';
  }
}

const error = computed(() => {
  try {
    convertBase({ value: input.value, fromBase: inputBase.value, toBase: outputBase.value });
    return '';
  }
  catch (error) {
    return error instanceof InvalidBaseDigitError
      ? t('toolContent.baseConverter.invalidDigit', { digit: error.digit, base: error.base })
      : t('toolContent.baseConverter.invalidNumber');
  }
});
</script>

<template>
  <div>
    <c-card>
      <c-input-text v-model:value="input" :label="$t('toolContent.baseConverter.inputNumber')" :placeholder="$t('toolContent.baseConverter.inputPlaceholder')" label-position="left" label-width="110px" mb-2 label-align="right" />

      <n-form-item :label="$t('toolContent.baseConverter.inputBase')" label-placement="left" label-width="110" :show-feedback="false">
        <n-input-number v-model:value="inputBase" max="64" min="2" :placeholder="$t('toolContent.baseConverter.basePlaceholder')" w-full />
      </n-form-item>

      <n-alert v-if="error" style="margin-top: 25px" type="error">
        {{ error }}
      </n-alert>
      <n-divider />

      <InputCopyable
        :label="$t('toolContent.baseConverter.binary')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 2 })"
        :placeholder="$t('toolContent.baseConverter.resultPlaceholder', { base: 2 })"
      />

      <InputCopyable
        :label="$t('toolContent.baseConverter.octal')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 8 })"
        :placeholder="$t('toolContent.baseConverter.resultPlaceholder', { base: 8 })"
      />

      <InputCopyable
        :label="$t('toolContent.baseConverter.decimal')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 10 })"
        :placeholder="$t('toolContent.baseConverter.resultPlaceholder', { base: 10 })"
      />

      <InputCopyable
        :label="$t('toolContent.baseConverter.hexadecimal')"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 16 })"
        :placeholder="$t('toolContent.baseConverter.resultPlaceholder', { base: 16 })"
      />

      <InputCopyable
        label="Base64 (64)"
        v-bind="inputProps"
        :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: 64 })"
        :placeholder="$t('toolContent.baseConverter.resultPlaceholder', { base: 64 })"
      />

      <div flex items-baseline>
        <n-input-group style="width: 160px; margin-right: 10px">
          <n-input-group-label>{{ $t('toolContent.baseConverter.custom') }}</n-input-group-label>
          <n-input-number v-model:value="outputBase" max="64" min="2" />
        </n-input-group>

        <InputCopyable
          flex-1
          v-bind="inputProps"
          :value="errorlessConvert({ value: input, fromBase: inputBase, toBase: outputBase })"
          :placeholder="$t('toolContent.baseConverter.resultPlaceholder', { base: outputBase })"
        />
      </div>
    </c-card>
  </div>
</template>

<style lang="less" scoped>
.n-input-group:not(:first-child) {
  margin-top: 5px;
}
</style>
