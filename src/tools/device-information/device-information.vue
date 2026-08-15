<script setup lang="ts">
import { useWindowSize } from '@vueuse/core';

const { width, height } = useWindowSize();
const { t } = useI18n();

const sections = computed(() => [
  {
    name: t('toolContent.device.screen'),
    information: [
      {
        label: t('toolContent.device.screenSize'),
        value: computed(() => `${window.screen.availWidth} x ${window.screen.availHeight}`),
      },
      {
        label: t('toolContent.device.orientation'),
        value: computed(() => window.screen.orientation.type),
      },
      {
        label: t('toolContent.device.orientationAngle'),
        value: computed(() => `${window.screen.orientation.angle}°`),
      },
      {
        label: t('toolContent.device.colorDepth'),
        value: computed(() => `${window.screen.colorDepth} bits`),
      },
      {
        label: t('toolContent.device.pixelRatio'),
        value: computed(() => `${window.devicePixelRatio} dppx`),
      },
      {
        label: t('toolContent.device.windowSize'),
        value: computed(() => `${width.value} x ${height.value}`),
      },
    ],
  },
  {
    name: t('toolContent.device.device'),
    information: [
      {
        label: t('toolContent.device.browserVendor'),
        value: computed(() => navigator.vendor),
      },
      {
        label: t('toolContent.device.languages'),
        value: computed(() => navigator.languages.join(', ')),
      },
      {
        label: t('toolContent.device.platform'),
        value: computed(() => navigator.platform),
      },
      {
        label: t('toolContent.device.userAgent'),
        value: computed(() => navigator.userAgent),
      },
    ],
  },
]);
</script>

<template>
  <c-card v-for="{ name, information } in sections" :key="name" :title="name">
    <n-grid cols="1 400:2" x-gap="12" y-gap="12">
      <n-gi v-for="{ label, value: { value } } in information" :key="label" class="information">
        <div class="label">
          {{ label }}
        </div>

        <div class="value">
          <n-ellipsis v-if="value">
            {{ value }}
          </n-ellipsis>
          <div v-else class="undefined-value">
            {{ $t('toolContent.device.unknown') }}
          </div>
        </div>
      </n-gi>
    </n-grid>
  </c-card>
</template>

<style lang="less" scoped>
.information {
  padding: 14px 16px;
  border-radius: 4px;
  background-color: #aaaaaa11;

  .label {
    font-size: 14px;
    opacity: 0.8;
    line-height: 1;
    margin-bottom: 5px;
  }
  .value {
    font-size: 20px;
    font-weight: 400;
  }

  .undefined-value {
    opacity: 0.8;
  }
}
</style>
