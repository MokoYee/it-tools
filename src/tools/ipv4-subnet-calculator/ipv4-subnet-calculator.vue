<script setup lang="ts">
import { Netmask } from 'netmask';
import { useStorage } from '@vueuse/core';
import { ArrowLeft, ArrowRight } from '@vicons/tabler';
import { getIPClass } from './ipv4-subnet-calculator.models';
import { withDefaultOnError } from '@/utils/defaults';
import { isNotThrowing } from '@/utils/boolean';
import SpanCopyable from '@/components/SpanCopyable.vue';

const ip = useStorage('ipv4-subnet-calculator:ip', '192.168.0.1/24');
const { t } = useI18n();

const getNetworkInfo = (address: string) => new Netmask(address.trim());

const networkInfo = computed(() => withDefaultOnError(() => getNetworkInfo(ip.value), undefined));

const ipValidationRules = computed(() => [
  {
    message: t('toolContent.ipv4Subnet.invalid'),
    validator: (value: string) => isNotThrowing(() => getNetworkInfo(value.trim())),
  },
]);

const sections = computed<{
  label: string
  getValue: (blocks: Netmask) => string | undefined
  undefinedFallback?: string
}[]>(() => [
      {
        label: t('toolContent.ipv4Subnet.netmask'),
        getValue: block => block.toString(),
      },
      {
        label: t('toolContent.ipv4Subnet.networkAddress'),
        getValue: ({ base }) => base,
      },
      {
        label: t('toolContent.ipv4Subnet.networkMask'),
        getValue: ({ mask }) => mask,
      },
      {
        label: t('toolContent.ipv4Subnet.binaryMask'),
        getValue: ({ bitmask }) => ('1'.repeat(bitmask) + '0'.repeat(32 - bitmask)).match(/.{8}/g)?.join('.') ?? '',
      },
      {
        label: t('toolContent.ipv4Subnet.cidr'),
        getValue: ({ bitmask }) => `/${bitmask}`,
      },
      {
        label: t('toolContent.ipv4Subnet.wildcard'),
        getValue: ({ hostmask }) => hostmask,
      },
      {
        label: t('toolContent.ipv4Subnet.size'),
        getValue: ({ size }) => String(size),
      },
      {
        label: t('toolContent.ipv4Subnet.first'),
        getValue: ({ first }) => first,
      },
      {
        label: t('toolContent.ipv4Subnet.last'),
        getValue: ({ last }) => last,
      },
      {
        label: t('toolContent.ipv4Subnet.broadcast'),
        getValue: ({ broadcast }) => broadcast,
        undefinedFallback: t('toolContent.ipv4Subnet.noBroadcast'),
      },
      {
        label: t('toolContent.ipv4Subnet.ipClass'),
        getValue: ({ base: ip }) => getIPClass({ ip }),
        undefinedFallback: t('toolContent.ipv4Subnet.unknownClass'),
      },
    ]);

function switchToBlock({ count = 1 }: { count?: number }) {
  const next = networkInfo.value?.next(count);

  if (next) {
    ip.value = next.toString();
  }
}
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ip"
      :label="$t('toolContent.ipv4Subnet.inputLabel')"
      :placeholder="$t('toolContent.ipv4.placeholder')"
      :validation-rules="ipValidationRules"
      mb-4
    />

    <div v-if="networkInfo">
      <n-table>
        <tbody>
          <tr v-for="{ getValue, label, undefinedFallback } in sections" :key="label">
            <td font-bold>
              {{ label }}
            </td>
            <td>
              <SpanCopyable v-if="getValue(networkInfo)" :value="getValue(networkInfo)" />
              <span v-else op-70>
                {{ undefinedFallback }}
              </span>
            </td>
          </tr>
        </tbody>
      </n-table>

      <div mt-3 flex items-center justify-between>
        <c-button @click="switchToBlock({ count: -1 })">
          <n-icon :component="ArrowLeft" />
          {{ $t('toolContent.ipv4Subnet.previous') }}
        </c-button>
        <c-button @click="switchToBlock({ count: 1 })">
          {{ $t('toolContent.ipv4Subnet.next') }}
          <n-icon :component="ArrowRight" />
        </c-button>
      </div>
    </div>
  </div>
</template>
