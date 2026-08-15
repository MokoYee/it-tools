<script setup lang="ts">
import { AES, RC4, Rabbit, TripleDES, enc } from 'crypto-js';
import { computedCatch } from '@/composable/computed/catchedComputed';

const algos = { AES, TripleDES, Rabbit, RC4 };

const cypherInput = ref('Lorem ipsum dolor sit amet');
const cypherAlgo = ref<keyof typeof algos>('AES');
const cypherSecret = ref('my secret key');
const cypherOutput = computed(() => algos[cypherAlgo.value].encrypt(cypherInput.value, cypherSecret.value).toString());

const decryptInput = ref('U2FsdGVkX1/EC3+6P5dbbkZ3e1kQ5o2yzuU0NHTjmrKnLBEwreV489Kr0DIB+uBs');
const decryptAlgo = ref<keyof typeof algos>('AES');
const decryptSecret = ref('my secret key');
const { t } = useI18n();
const [decryptOutput, decryptError] = computedCatch(() => algos[decryptAlgo.value].decrypt(decryptInput.value, decryptSecret.value).toString(enc.Utf8), {
  defaultValue: '',
  defaultErrorMessage: t('toolContent.encryption.decryptError'),
});
</script>

<template>
  <c-card :title="$t('toolContent.encryption.encrypt')">
    <div flex gap-3>
      <c-input-text
        v-model:value="cypherInput"
        :label="$t('toolContent.encryption.plainText')"
        :placeholder="$t('toolContent.encryption.plainPlaceholder')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="cypherSecret" :label="$t('toolContent.encryption.secret')" clearable raw-text />

        <c-select
          v-model:value="cypherAlgo"
          :label="$t('toolContent.encryption.algorithm')"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-input-text
      :label="$t('toolContent.encryption.encryptedOutput')"
      :value="cypherOutput"
      rows="3"
      :placeholder="$t('toolContent.encryption.outputPlaceholder')"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
  <c-card :title="$t('toolContent.encryption.decrypt')">
    <div flex gap-3>
      <c-input-text
        v-model:value="decryptInput"
        :label="$t('toolContent.encryption.encryptedInput')"
        :placeholder="$t('toolContent.encryption.encryptedPlaceholder')"
        rows="4"
        multiline raw-text monospace autosize flex-1
      />
      <div flex flex-1 flex-col gap-2>
        <c-input-text v-model:value="decryptSecret" :label="$t('toolContent.encryption.secret')" clearable raw-text />

        <c-select
          v-model:value="decryptAlgo"
          :label="$t('toolContent.encryption.algorithm')"
          :options="Object.keys(algos).map((label) => ({ label, value: label }))"
        />
      </div>
    </div>
    <c-alert v-if="decryptError" type="error" mt-12 :title="$t('toolContent.encryption.errorTitle')">
      {{ decryptError }}
    </c-alert>
    <c-input-text
      v-else
      :label="$t('toolContent.encryption.decryptedOutput')"
      :value="decryptOutput"
      :placeholder="$t('toolContent.encryption.outputPlaceholder')"
      rows="3"
      multiline monospace readonly autosize mt-5
    />
  </c-card>
</template>
