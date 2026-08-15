<script setup lang="ts">
import { codesByCategories } from './http-status-codes.constants';
import { useFuzzySearch } from '@/composable/fuzzySearch';

const search = ref('');
const { locale, t } = useI18n();

const localizedCodesByCategories = computed(() => {
  if (locale.value !== 'zh') {
    return codesByCategories;
  }

  return codesByCategories.map(({ codes }, categoryIndex) => ({
    category: t(`toolContent.httpStatus.categories.${categoryIndex}`),
    codes: codes.map(code => ({
      ...code,
      name: t(`toolContent.httpStatus.codes.${code.code}.name`),
      description: t(`toolContent.httpStatus.codes.${code.code}.description`),
    })),
  }));
});

const { searchResult } = useFuzzySearch({
  search,
  data: localizedCodesByCategories.value.flatMap(({ codes, category }) => codes.map(code => ({ ...code, category }))),
  options: {
    keys: [{ name: 'code', weight: 3 }, { name: 'name', weight: 2 }, 'description', 'category'],
  },
});

const codesByCategoryFiltered = computed(() => {
  if (!search.value) {
    return localizedCodesByCategories.value;
  }

  return [{ category: t('toolContent.httpStatus.searchResults'), codes: searchResult.value }];
});
</script>

<template>
  <div>
    <c-input-text
      v-model:value="search"
      :placeholder="$t('toolContent.httpStatus.placeholder')"
      autofocus raw-text mb-10
    />

    <div v-for="{ codes, category } of codesByCategoryFiltered" :key="category" mb-8>
      <div mb-2 text-xl>
        {{ category }}
      </div>

      <c-card v-for="{ code, description, name, type } of codes" :key="code" mb-2>
        <div text-lg font-bold>
          {{ code }} {{ name }}
        </div>
        <div op-70>
          {{ description }} {{ type !== 'HTTP' ? $t('toolContent.httpStatus.forProtocol', { type }) : '' }}
        </div>
      </c-card>
    </div>
  </div>
</template>
