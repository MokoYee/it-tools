<script setup lang="ts">
import db from 'oui-data';
import { createMacAddressValidationRules } from '@/utils/macAddress';
import { useCopy } from '@/composable/copy';

const getVendorValue = (address: string) => address.trim().replace(/[.:-]/g, '').toUpperCase().substring(0, 6);

const macAddress = ref('20:37:06:12:34:56');
const { t } = useI18n();
const details = computed<string | undefined>(() => (db as Record<string, string>)[getVendorValue(macAddress.value)]);
const macAddressValidationRules = computed(() => createMacAddressValidationRules(t('toolContent.mac.invalid')));

const { copy } = useCopy({ source: () => details.value ?? '', text: () => t('toolContent.mac.vendorCopied') });
</script>

<template>
  <div>
    <c-input-text
      v-model:value="macAddress"
      :label="$t('toolContent.mac.inputLabel')"
      size="large"
      :placeholder="$t('toolContent.mac.placeholder')"
      clearable
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      :validation-rules="macAddressValidationRules"
      mb-5
    />

    <div mb-5px>
      {{ $t('toolContent.mac.vendorInfo') }}
    </div>
    <c-card mb-5>
      <div v-if="details">
        <div v-for="(detail, index) of details.split('\n')" :key="index">
          {{ detail }}
        </div>
      </div>

      <div v-else italic op-60>
        {{ $t('toolContent.mac.unknownVendor') }}
      </div>
    </c-card>

    <div flex justify-center>
      <c-button :disabled="!details" @click="copy()">
        {{ $t('toolContent.mac.copyVendor') }}
      </c-button>
    </div>
  </div>
</template>
