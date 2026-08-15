<script setup lang="ts">
import cronstrue from 'cronstrue/i18n.js';
import { isValidCron } from 'cron-validator';
import { useStyleStore } from '@/stores/style.store';

function isCronValid(v: string) {
  return isValidCron(v, { allowBlankDay: true, alias: true, seconds: true });
}

const styleStore = useStyleStore();
const { locale, t } = useI18n();

const cron = ref('40 * * * *');
const cronstrueConfig = reactive({
  verbose: true,
  dayOfWeekStartIndexZero: true,
  use24HourTimeFormat: true,
  throwExceptionOnParseError: true,
});

const helpers = computed(() => [
  {
    symbol: '*',
    meaning: t('toolContent.cron.anyValue'),
    example: '* * * *',
    equivalent: t('toolContent.cron.everyMinute'),
  },
  {
    symbol: '-',
    meaning: t('toolContent.cron.range'),
    example: '1-10 * * *',
    equivalent: t('toolContent.cron.minutesRange'),
  },
  {
    symbol: ',',
    meaning: t('toolContent.cron.list'),
    example: '1,10 * * *',
    equivalent: t('toolContent.cron.atMinutes'),
  },
  {
    symbol: '/',
    meaning: t('toolContent.cron.step'),
    example: '*/10 * * *',
    equivalent: t('toolContent.cron.everyTenMinutes'),
  },
  {
    symbol: '@yearly',
    meaning: t('toolContent.cron.yearly'),
    example: '@yearly',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@annually',
    meaning: t('toolContent.cron.sameAsYearly'),
    example: '@annually',
    equivalent: '0 0 1 1 *',
  },
  {
    symbol: '@monthly',
    meaning: t('toolContent.cron.monthly'),
    example: '@monthly',
    equivalent: '0 0 1 * *',
  },
  {
    symbol: '@weekly',
    meaning: t('toolContent.cron.weekly'),
    example: '@weekly',
    equivalent: '0 0 * * 0',
  },
  {
    symbol: '@daily',
    meaning: t('toolContent.cron.daily'),
    example: '@daily',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@midnight',
    meaning: t('toolContent.cron.sameAsDaily'),
    example: '@midnight',
    equivalent: '0 0 * * *',
  },
  {
    symbol: '@hourly',
    meaning: t('toolContent.cron.hourly'),
    example: '@hourly',
    equivalent: '0 * * * *',
  },
  {
    symbol: '@reboot',
    meaning: t('toolContent.cron.reboot'),
    example: '',
    equivalent: '',
  },
]);

const cronString = computed(() => {
  if (isCronValid(cron.value)) {
    return cronstrue.toString(cron.value, { ...cronstrueConfig, locale: locale.value === 'zh' ? 'zh_CN' : 'en' });
  }
  return ' ';
});

const cronValidationRules = computed(() => [
  {
    validator: (value: string) => isCronValid(value),
    message: t('toolContent.cron.invalid'),
  },
]);
</script>

<template>
  <c-card>
    <div mx-auto max-w-sm>
      <c-input-text
        v-model:value="cron"
        size="large"
        placeholder="* * * * *"
        :validation-rules="cronValidationRules"
        mb-3
      />
    </div>

    <div class="cron-string">
      {{ cronString }}
    </div>

    <n-divider />

    <div flex justify-center>
      <n-form :show-feedback="false" label-width="170" label-placement="left">
        <n-form-item :label="$t('toolContent.cron.verbose')">
          <n-switch v-model:value="cronstrueConfig.verbose" />
        </n-form-item>
        <n-form-item :label="$t('toolContent.cron.use24Hour')">
          <n-switch v-model:value="cronstrueConfig.use24HourTimeFormat" />
        </n-form-item>
        <n-form-item :label="$t('toolContent.cron.daysStartAtZero')">
          <n-switch v-model:value="cronstrueConfig.dayOfWeekStartIndexZero" />
        </n-form-item>
      </n-form>
    </div>
  </c-card>
  <c-card>
    <pre>{{ $t('toolContent.cron.diagram') }}</pre>

    <div v-if="styleStore.isSmallScreen">
      <c-card v-for="{ symbol, meaning, example, equivalent } in helpers" :key="symbol" mb-3 important:border-none>
        <div>
          {{ $t('toolContent.cron.symbol') }} <strong>{{ symbol }}</strong>
        </div>
        <div>
          {{ $t('toolContent.cron.meaning') }} <strong>{{ meaning }}</strong>
        </div>
        <div>
          {{ $t('toolContent.cron.example') }}
          <strong><code>{{ example }}</code></strong>
        </div>
        <div>
          {{ $t('toolContent.cron.equivalent') }} <strong>{{ equivalent }}</strong>
        </div>
      </c-card>
    </div>

    <c-table
      v-else
      :data="helpers"
      :headers="{
        symbol: $t('toolContent.cron.symbol'),
        meaning: $t('toolContent.cron.meaning'),
        example: $t('toolContent.cron.example'),
        equivalent: $t('toolContent.cron.equivalent'),
      }"
    />
  </c-card>
</template>

<style lang="less" scoped>
::v-deep(input) {
  font-size: 30px;
  font-family: monospace;
  padding: 5px;
  text-align: center;
}

.cron-string {
  text-align: center;
  font-size: 22px;
  opacity: 0.8;
  margin: 5px 0 15px;
}

pre {
  overflow: auto;
  padding: 10px 0;
}
</style>
