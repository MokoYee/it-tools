import { type MaybeRefOrGetter, type Ref, computed, toValue } from 'vue';
import { useValidation } from '@/composable/validation';

function createMacAddressValidationRules(message = 'Invalid MAC address') {
  return [
    {
      message,
      validator: (value: string) => value.trim().match(/^([0-9A-Fa-f]{2}[:-]){2,5}([0-9A-Fa-f]{2})$/),
    },
  ];
}

const macAddressValidationRules = createMacAddressValidationRules();

function macAddressValidation(value: Ref<string>, message: MaybeRefOrGetter<string> = 'Invalid MAC address') {
  return useValidation<string>({
    source: value,
    rules: computed(() => createMacAddressValidationRules(toValue(message))),
  });
}

function createPartialMacAddressValidationRules(message = 'Invalid partial MAC address') {
  return [
    {
      message,
      validator: (value: string) => value.trim().match(/^([0-9a-f]{2}[:\-. ]){0,5}([0-9a-f]{0,2})$/i),
    },
  ];
}

const partialMacAddressValidationRules = createPartialMacAddressValidationRules();

function usePartialMacAddressValidation(value: Ref<string>, message: MaybeRefOrGetter<string> = 'Invalid partial MAC address') {
  return useValidation<string>({
    source: value,
    rules: computed(() => createPartialMacAddressValidationRules(toValue(message))),
  });
}

export {
  createMacAddressValidationRules,
  createPartialMacAddressValidationRules,
  macAddressValidation,
  macAddressValidationRules,
  partialMacAddressValidationRules,
  usePartialMacAddressValidation,
};
