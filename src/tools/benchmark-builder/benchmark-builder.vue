<script setup lang="ts">
import { Plus, Trash } from '@vicons/tabler';
import { useStorage } from '@vueuse/core';
import _ from 'lodash';

import { arrayToMarkdownTable, computeAverage, computeVariance } from './benchmark-builder.models';
import DynamicValues from './dynamic-values.vue';
import { useCopy } from '@/composable/copy';

const { t } = useI18n();
const suites = useStorage('benchmark-builder:suites', [
  { title: t('toolContent.benchmark.suiteNumber', { number: 1 }), data: [5, 10] },
  { title: t('toolContent.benchmark.suiteNumber', { number: 2 }), data: [8, 12] },
]);

const unit = useStorage('benchmark-builder:unit', '');

const round = (v: number) => Math.round(v * 1000) / 1000;

const results = computed(() => {
  return suites.value
    .map(({ data: dirtyData, title }) => {
      const data = dirtyData.filter(_.isNumber);

      return {
        title,
        size: data.length,
        mean: computeAverage({ data }),
        variance: computeVariance({ data }),
      };
    })
    .sort((a, b) => a.mean - b.mean)
    .map(({ mean, variance, size, title }, index, suites) => {
      const cleanUnit = unit.value.trim();
      const bestMean: number = suites[0].mean;
      const deltaWithBestMean = mean - bestMean;
      const ratioWithBestMean = bestMean === 0 ? '∞' : round(mean / bestMean);

      const comparisonValues: string
        = (index !== 0 && bestMean !== mean) ? ` (+${round(deltaWithBestMean)}${cleanUnit} ; x${ratioWithBestMean})` : '';

      return {
        position: index + 1,
        title,
        mean: `${round(mean)}${cleanUnit}${comparisonValues}`,
        variance: `${round(variance)}${cleanUnit}${cleanUnit ? '²' : ''}`,
        size,
      };
    });
});

const { copy } = useCopy({ createToast: false });

const header = computed(() => ({
  position: t('toolContent.benchmark.position'),
  title: t('toolContent.benchmark.suite'),
  size: t('toolContent.benchmark.samples'),
  mean: t('toolContent.benchmark.mean'),
  variance: t('toolContent.benchmark.variance'),
}));

function copyAsMarkdown() {
  copy(arrayToMarkdownTable({ data: results.value, headerMap: header.value }));
}

function copyAsBulletList() {
  const bulletList = results.value
    .flatMap(({ title, ...sections }) => {
      return [
        ` - ${title}`,
        ...Object.entries(sections).map(
          ([key, value]) => `    - ${header.value[key as keyof typeof header.value] ?? key}: ${value}`,
        ),
      ];
    })
    .join('\n');

  copy(bulletList);
}

function resetSuites() {
  suites.value = [
    { title: t('toolContent.benchmark.suiteNumber', { number: 1 }), data: [] },
    { title: t('toolContent.benchmark.suiteNumber', { number: 2 }), data: [] },
  ];
}
</script>

<template>
  <n-scrollbar style="flex: 1" x-scrollable>
    <div mb-5 flex flex-1 flex-nowrap justify-center gap-12px>
      <div v-for="(suite, index) of suites" :key="index">
        <c-card style="width: 294px">
          <c-input-text
            v-model:value="suite.title"
            label-position="left"
            :label="$t('toolContent.benchmark.suiteName')"
            :placeholder="$t('toolContent.benchmark.suiteNamePlaceholder')"
            clearable
          />

          <n-divider />
          <n-form-item :label="$t('toolContent.benchmark.suiteValues')" :show-feedback="false">
            <DynamicValues v-model:values="suite.data" />
          </n-form-item>
        </c-card>

        <div flex justify-center>
          <c-button v-if="suites.length > 1" variant="text" @click="suites.splice(index, 1)">
            <n-icon :component="Trash" depth="3" mr-2 size="18" />
            {{ $t('toolContent.benchmark.deleteSuite') }}
          </c-button>
          <c-button
            variant="text"
            @click="suites.splice(index + 1, 0, { data: [0], title: t('toolContent.benchmark.suiteNumber', { number: suites.length + 1 }) })"
          >
            <n-icon :component="Plus" depth="3" mr-2 size="18" />
            {{ $t('toolContent.benchmark.addSuite') }}
          </c-button>
        </div>
      </div>
    </div>
  </n-scrollbar>

  <div style="flex: 0 0 100%">
    <div style="max-width: 600px; margin: 0 auto">
      <div mx-auto max-w-sm flex justify-center gap-3>
        <c-input-text v-model:value="unit" :placeholder="$t('toolContent.benchmark.unitPlaceholder')" :label="$t('toolContent.benchmark.unit')" label-position="left" mb-4 />

        <c-button
          @click="resetSuites"
        >
          {{ $t('toolContent.benchmark.reset') }}
        </c-button>
      </div>

      <c-table :data="results" :headers="header" />

      <div mt-5 flex justify-center gap-3>
        <c-button @click="copyAsMarkdown()">
          {{ $t('toolContent.benchmark.copyMarkdown') }}
        </c-button>
        <c-button @click="copyAsBulletList()">
          {{ $t('toolContent.benchmark.copyList') }}
        </c-button>
      </div>
    </div>
  </div>
</template>
