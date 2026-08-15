<script setup lang="ts">
import { useCopy } from '@/composable/copy';
import { textToBase64 } from '@/utils/base64';

const username = ref('');
const password = ref('');
const header = computed(() => `Authorization: Basic ${textToBase64(`${username.value}:${password.value}`)}`);
const { t } = useI18n();

const { copy } = useCopy({ source: header, text: () => t('toolContent.basicAuth.headerCopied') });
</script>

<template>
  <div>
    <c-input-text v-model:value="username" :label="$t('toolContent.basicAuth.username')" :placeholder="$t('toolContent.basicAuth.usernamePlaceholder')" clearable raw-text mb-5 />
    <c-input-text
      v-model:value="password"
      :label="$t('toolContent.basicAuth.password')"
      :placeholder="$t('toolContent.basicAuth.passwordPlaceholder')"
      clearable
      raw-text
      mb-2
      type="password"
    />

    <c-card>
      <n-statistic :label="$t('toolContent.basicAuth.header')" class="header">
        <n-scrollbar x-scrollable style="max-width: 550px; margin-bottom: -10px; padding-bottom: 10px" trigger="none">
          {{ header }}
        </n-scrollbar>
      </n-statistic>
    </c-card>
    <div mt-5 flex justify-center>
      <c-button @click="copy()">
        {{ $t('toolContent.basicAuth.copyHeader') }}
      </c-button>
    </div>
  </div>
</template>

<style lang="less" scoped>
::v-deep(.n-statistic-value__content) {
  font-family: monospace;
  font-size: 17px !important;
  white-space: nowrap;
}
</style>
