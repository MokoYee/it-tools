<script setup lang="ts">
import { extractIBAN, friendlyFormatIBAN, isQRIBAN, validateIBAN } from 'ibantools';
import { getFriendlyErrors } from './iban-validator-and-parser.service';
import type { CKeyValueListItems } from '@/ui/c-key-value-list/c-key-value-list.types';

const rawIban = ref('');
const { t } = useI18n();
const errorTranslationKeys: Record<string, string> = {
  'No IBAN provided': 'toolContent.iban.errors.noIban',
  'No IBAN country': 'toolContent.iban.errors.noCountry',
  'Wrong BBAN length': 'toolContent.iban.errors.wrongBbanLength',
  'Wrong BBAN format': 'toolContent.iban.errors.wrongBbanFormat',
  'Checksum is not a number': 'toolContent.iban.errors.checksumNotNumber',
  'Wrong IBAN checksum': 'toolContent.iban.errors.wrongIbanChecksum',
  'Wrong account bank branch checksum': 'toolContent.iban.errors.wrongBranchChecksum',
  'QR-IBAN not allowed': 'toolContent.iban.errors.qrNotAllowed',
};

const ibanInfo = computed<CKeyValueListItems>(() => {
  const iban = rawIban.value.toUpperCase().replace(/\s/g, '').replace(/-/g, '');

  if (iban === '') {
    return [];
  }

  const { valid: isIbanValid, errorCodes } = validateIBAN(iban);
  const { countryCode, bban } = extractIBAN(iban);
  const errors = getFriendlyErrors(errorCodes).map((message) => {
    const translationKey = errorTranslationKeys[message];
    return translationKey ? t(translationKey) : message;
  });

  return [

    {
      label: t('toolContent.iban.isValid'),
      value: isIbanValid,
      showCopyButton: false,
    },
    {
      label: t('toolContent.iban.errorsLabel'),
      value: errors.length === 0 ? undefined : errors,
      hideOnNil: true,
      showCopyButton: false,
    },
    {
      label: t('toolContent.iban.isQrIban'),
      value: isQRIBAN(iban),
      showCopyButton: false,
    },
    {
      label: t('toolContent.iban.countryCode'),
      value: countryCode,
    },
    {
      label: 'BBAN',
      value: bban,
    },
    {
      label: t('toolContent.iban.friendlyFormat'),
      value: friendlyFormatIBAN(iban),
    },
  ];
});

const ibanExamples = [
  'FR7630006000011234567890189',
  'DE89370400440532013000',
  'GB29NWBK60161331926819',
];
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIban" :placeholder="$t('toolContent.iban.placeholder')" test-id="iban-input" />

    <c-card v-if="ibanInfo.length > 0" mt-5>
      <c-key-value-list :items="ibanInfo" data-test-id="iban-info" />
    </c-card>

    <c-card :title="$t('toolContent.iban.examples')" mt-5>
      <div v-for="iban in ibanExamples" :key="iban">
        <c-text-copyable :value="iban" font-mono :displayed-value="friendlyFormatIBAN(iban)" />
      </div>
    </c-card>
  </div>
</template>
