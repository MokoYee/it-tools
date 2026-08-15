<script setup lang="ts">
import { convertBase } from '../integer-base-converter/integer-base-converter.model';
import { ipv4ToInt, ipv4ToIpv6, isValidIpv4 } from './ipv4-address-converter.service';
import { useValidation } from '@/composable/validation';

const rawIpAddress = useStorage('ipv4-converter:ip', '192.168.1.1');
const { t } = useI18n();

const convertedSections = computed(() => {
  const ipInDecimal = ipv4ToInt({ ip: rawIpAddress.value });

  return [
    {
      label: t('toolContent.ipv4.decimal'),
      value: String(ipInDecimal),
    },
    {
      label: t('toolContent.ipv4.hexadecimal'),
      value: convertBase({ fromBase: 10, toBase: 16, value: String(ipInDecimal) }).toUpperCase(),
    },
    {
      label: t('toolContent.ipv4.binary'),
      value: convertBase({ fromBase: 10, toBase: 2, value: String(ipInDecimal) }),
    },
    {
      label: 'IPv6: ',
      value: ipv4ToIpv6({ ip: rawIpAddress.value }),
    },
    {
      label: t('toolContent.ipv4.ipv6Short'),
      value: ipv4ToIpv6({ ip: rawIpAddress.value, prefix: '::ffff:' }),
    },
  ];
});

const { attrs: validationAttrs } = useValidation<string>({
  source: rawIpAddress,
  rules: computed(() => [{ message: t('toolContent.ipv4.invalid'), validator: (ip: string) => isValidIpv4({ ip }) }]),
});
</script>

<template>
  <div>
    <c-input-text v-model:value="rawIpAddress" :label="$t('toolContent.ipv4.inputLabel')" :placeholder="$t('toolContent.ipv4.placeholder')" />

    <n-divider />

    <input-copyable
      v-for="{ label, value } of convertedSections"
      :key="label"
      :label="label"
      label-position="left"
      label-width="100px"
      label-align="right"
      mb-2
      :value="validationAttrs.validationStatus === 'error' ? '' : value"
      :placeholder="$t('toolContent.ipv4.correctPlaceholder')"
    />
  </div>
</template>
