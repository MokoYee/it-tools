<script setup lang="ts">
import { getCountries, getCountryCallingCode, parsePhoneNumber } from 'libphonenumber-js/max';
import lookup from 'country-code-lookup';
import { getDefaultCountryCode } from './phone-parser-and-formatter.models';
import { withDefaultOnError } from '@/utils/defaults';
import { useValidation } from '@/composable/validation';

const rawPhone = ref('');
const defaultCountryCode = ref(getDefaultCountryCode());
const { locale, t } = useI18n();
const regionNames = computed(() => new Intl.DisplayNames([locale.value], { type: 'region' }));
const validation = useValidation<string>({
  source: rawPhone,
  rules: computed(() => [
    {
      validator: value => value === '' || /^[0-9 +\-()]+$/.test(value),
      message: t('toolContent.phone.invalid'),
    },
  ]),
});

const parsedDetails = computed(() => {
  if (!validation.isValid) {
    return undefined;
  }

  const parsed = withDefaultOnError(() => parsePhoneNumber(rawPhone.value, defaultCountryCode.value), undefined);

  if (!parsed) {
    return undefined;
  }

  return [
    {
      label: t('toolContent.phone.countryCode'),
      value: parsed.country,
    },
    {
      label: t('toolContent.phone.country'),
      value: parsed.country ? regionNames.value.of(parsed.country) : undefined,
    },
    {
      label: t('toolContent.phone.callingCode'),
      value: parsed.countryCallingCode,
    },
    {
      label: t('toolContent.phone.isValid'),
      value: parsed.isValid() ? t('toolContent.phone.yes') : t('toolContent.phone.no'),
    },
    {
      label: t('toolContent.phone.isPossible'),
      value: parsed.isPossible() ? t('toolContent.phone.yes') : t('toolContent.phone.no'),
    },
    {
      label: t('toolContent.phone.type'),
      value: parsed.getType() ? t(`toolContent.phone.types.${parsed.getType()}`) : undefined,
    },
    {
      label: t('toolContent.phone.international'),
      value: parsed.formatInternational(),
    },
    {
      label: t('toolContent.phone.national'),
      value: parsed.formatNational(),
    },
    {
      label: 'E.164 format',
      value: parsed.format('E.164'),
    },
    {
      label: 'RFC3966 format',
      value: parsed.format('RFC3966'),
    },
  ];
});

const countriesOptions = computed(() => getCountries().map(code => ({
  label: `${regionNames.value.of(code) || lookup.byIso(code)?.country || code} (+${getCountryCallingCode(code)})`,
  value: code,
})));
</script>

<template>
  <div>
    <c-select v-model:value="defaultCountryCode" :label="$t('toolContent.phone.defaultCountry')" :options="countriesOptions" searchable mb-5 />

    <c-input-text
      v-model:value="rawPhone"
      :placeholder="$t('toolContent.phone.placeholder')"
      :label="$t('toolContent.phone.inputLabel')"
      :validation="validation"
      mb-5
    />

    <n-table v-if="parsedDetails">
      <tbody>
        <tr v-for="{ label, value } in parsedDetails" :key="label">
          <td font-bold>
            {{ label }}
          </td>
          <td>
            <span-copyable v-if="value" :value="value" />
            <span v-else op-70>
              {{ $t('toolContent.phone.unknown') }}
            </span>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
