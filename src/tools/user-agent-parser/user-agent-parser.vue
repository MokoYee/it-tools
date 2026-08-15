<script setup lang="ts">
import { UAParser } from 'ua-parser-js';
import { Adjustments, Browser, Cpu, Devices, Engine } from '@vicons/tabler';
import UserAgentResultCards from './user-agent-result-cards.vue';
import type { UserAgentResultSection } from './user-agent-parser.types';
import { withDefaultOnError } from '@/utils/defaults';

const ua = ref(navigator.userAgent as string);
const { t } = useI18n();

// If not input in the ua field is present return an empty object of type UAParser.IResult because otherwise
// UAParser returns the values for the current Browser. This is confusing because results are shown for an empty
// UA field value.
function getUserAgentInfo(userAgent: string) {
  return userAgent.trim().length > 0
    ? UAParser(userAgent.trim())
    : ({ ua: '', browser: {}, cpu: {}, device: {}, engine: {}, os: {} } as UAParser.IResult);
}
const userAgentInfo = computed(() => withDefaultOnError(() => getUserAgentInfo(ua.value), undefined));

const sections = computed<UserAgentResultSection[]>(() => [
  {
    heading: t('toolContent.userAgent.browser'),
    icon: Browser,
    content: [
      {
        label: t('toolContent.userAgent.name'),
        getValue: block => block?.browser.name,
        undefinedFallback: t('toolContent.userAgent.noBrowserName'),
      },
      {
        label: t('toolContent.userAgent.version'),
        getValue: block => block?.browser.version,
        undefinedFallback: t('toolContent.userAgent.noBrowserVersion'),
      },
    ],
  },
  {
    heading: t('toolContent.userAgent.engine'),
    icon: Engine,
    content: [
      {
        label: t('toolContent.userAgent.name'),
        getValue: block => block?.engine.name,
        undefinedFallback: t('toolContent.userAgent.noEngineName'),
      },
      {
        label: t('toolContent.userAgent.version'),
        getValue: block => block?.engine.version,
        undefinedFallback: t('toolContent.userAgent.noEngineVersion'),
      },
    ],
  },
  {
    heading: t('toolContent.userAgent.os'),
    icon: Adjustments,
    content: [
      {
        label: t('toolContent.userAgent.name'),
        getValue: block => block?.os.name,
        undefinedFallback: t('toolContent.userAgent.noOsName'),
      },
      {
        label: t('toolContent.userAgent.version'),
        getValue: block => block?.os.version,
        undefinedFallback: t('toolContent.userAgent.noOsVersion'),
      },
    ],
  },
  {
    heading: t('toolContent.userAgent.device'),
    icon: Devices,
    content: [
      {
        label: t('toolContent.userAgent.model'),
        getValue: block => block?.device.model,
        undefinedFallback: t('toolContent.userAgent.noDeviceModel'),
      },
      {
        label: t('toolContent.userAgent.type'),
        getValue: block => block?.device.type,
        undefinedFallback: t('toolContent.userAgent.noDeviceType'),
      },
      {
        label: t('toolContent.userAgent.vendor'),
        getValue: block => block?.device.vendor,
        undefinedFallback: t('toolContent.userAgent.noDeviceVendor'),
      },
    ],
  },
  {
    heading: 'CPU',
    icon: Cpu,
    content: [
      {
        label: t('toolContent.userAgent.architecture'),
        getValue: block => block?.cpu.architecture,
        undefinedFallback: t('toolContent.userAgent.noCpuArchitecture'),
      },
    ],
  },
]);
</script>

<template>
  <div>
    <c-input-text
      v-model:value="ua"
      :label="$t('toolContent.userAgent.inputLabel')"
      multiline
      :placeholder="$t('toolContent.userAgent.placeholder')"
      clearable
      raw-text
      rows="2"
      autosize
      monospace
      mb-3
    />

    <UserAgentResultCards :user-agent-info="userAgentInfo" :sections="sections" />
  </div>
</template>
