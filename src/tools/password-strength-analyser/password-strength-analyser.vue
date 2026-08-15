<script setup lang="ts">
import { getPasswordCrackTimeEstimation } from './password-strength-analyser.service';

const password = ref('');
const { locale, t } = useI18n();
const crackTimeEstimation = computed(() => getPasswordCrackTimeEstimation({ password: password.value, locale: locale.value }));

const details = computed(() => [
  {
    label: t('toolContent.password.length'),
    value: crackTimeEstimation.value.passwordLength,
  },
  {
    label: t('toolContent.password.entropy'),
    value: Math.round(crackTimeEstimation.value.entropy * 100) / 100,
  },
  {
    label: t('toolContent.password.charset'),
    value: crackTimeEstimation.value.charsetLength,
  },
  {
    label: t('toolContent.password.score'),
    value: `${Math.round(crackTimeEstimation.value.score * 100)} / 100`,
  },
]);
</script>

<template>
  <div flex flex-col gap-3>
    <c-input-text
      v-model:value="password"
      type="password"
      :placeholder="$t('toolContent.password.placeholder')"
      clearable
      autofocus
      raw-text
      test-id="password-input"
    />

    <c-card text-center>
      <div op-60>
        {{ $t('toolContent.password.duration') }}
      </div>
      <div text-2xl data-test-id="crack-duration">
        {{ crackTimeEstimation.crackDurationFormatted }}
      </div>
    </c-card>
    <c-card>
      <div v-for="({ label, value }) of details" :key="label" flex gap-3>
        <div flex-1 text-right op-60>
          {{ label }}
        </div>
        <div flex-1 text-left>
          {{ value }}
        </div>
      </div>
    </c-card>
    <div op-70>
      <span font-bold>{{ $t('toolContent.password.note') }}</span>
      {{ $t('toolContent.password.noteDescription') }}
    </div>
  </div>
</template>
