<script setup lang="ts">
import { Exchange } from '@vicons/tabler';
import { isValidIpv4 } from '../ipv4-address-converter/ipv4-address-converter.service';
import type { Ipv4RangeExpanderResult } from './ipv4-range-expander.types';
import { calculateCidr } from './ipv4-range-expander.service';
import ResultRow from './result-row.vue';
import { useValidation } from '@/composable/validation';

const rawStartAddress = useStorage('ipv4-range-expander:startAddress', '192.168.1.1');
const rawEndAddress = useStorage('ipv4-range-expander:endAddress', '192.168.6.255');
const { t } = useI18n();

const result = computed(() => calculateCidr({ startIp: rawStartAddress.value, endIp: rawEndAddress.value }));

const calculatedValues = computed<{
  label: string
  getOldValue: (result: Ipv4RangeExpanderResult | undefined) => string | undefined
  getNewValue: (result: Ipv4RangeExpanderResult | undefined) => string | undefined
}[]>(() => [
      {
        label: t('toolContent.ipv4Range.start'),
        getOldValue: () => rawStartAddress.value,
        getNewValue: result => result?.newStart,
      },
      {
        label: t('toolContent.ipv4Range.end'),
        getOldValue: () => rawEndAddress.value,
        getNewValue: result => result?.newEnd,
      },
      {
        label: t('toolContent.ipv4Range.addressCount'),
        getOldValue: result => result?.oldSize?.toLocaleString(),
        getNewValue: result => result?.newSize?.toLocaleString(),
      },
      {
        label: 'CIDR',
        getOldValue: () => '',
        getNewValue: result => result?.newCidr,
      },
    ]);

const startIpValidation = useValidation<string>({
  source: rawStartAddress,
  rules: computed(() => [{ message: t('toolContent.ipv4.invalid'), validator: (ip: string) => isValidIpv4({ ip }) }]),
});
const endIpValidation = useValidation<string>({
  source: rawEndAddress,
  rules: computed(() => [{ message: t('toolContent.ipv4.invalid'), validator: (ip: string) => isValidIpv4({ ip }) }]),
});

const showResult = computed(() => endIpValidation.isValid && startIpValidation.isValid && result.value !== undefined);

function onSwitchStartEndClicked() {
  const tmpStart = rawStartAddress.value;
  rawStartAddress.value = rawEndAddress.value;
  rawEndAddress.value = tmpStart;
}
</script>

<template>
  <div>
    <div mb-4 flex gap-4>
      <c-input-text
        v-model:value="rawStartAddress"
        :label="$t('toolContent.ipv4Range.start')"
        :placeholder="$t('toolContent.ipv4Range.startPlaceholder')"
        :validation="startIpValidation"
        clearable
      />

      <c-input-text
        v-model:value="rawEndAddress"
        :label="$t('toolContent.ipv4Range.end')"
        :placeholder="$t('toolContent.ipv4Range.endPlaceholder')"
        :validation="endIpValidation"
        clearable
      />
    </div>

    <n-table v-if="showResult" data-test-id="result">
      <thead>
        <tr>
          <th scope="col">
&nbsp;
          </th>
          <th scope="col">
            {{ $t('toolContent.ipv4Range.oldValue') }}
          </th>
          <th scope="col">
            {{ $t('toolContent.ipv4Range.newValue') }}
          </th>
        </tr>
      </thead>
      <tbody>
        <ResultRow
          v-for="{ label, getOldValue, getNewValue } in calculatedValues"
          :key="label"
          :label="label"
          :old-value="getOldValue(result)"
          :new-value="getNewValue(result)"
        />
      </tbody>
    </n-table>
    <n-alert
      v-else-if="startIpValidation.isValid && endIpValidation.isValid"
      :title="$t('toolContent.ipv4Range.invalidRange')"
      type="error"
    >
      <div my-3 op-70>
        {{ $t('toolContent.ipv4Range.invalidRangeDescription') }}
      </div>

      <c-button @click="onSwitchStartEndClicked">
        <n-icon mr-2 :component="Exchange" depth="3" size="22" />
        {{ $t('toolContent.ipv4Range.switch') }}
      </c-button>
    </n-alert>
  </div>
</template>
