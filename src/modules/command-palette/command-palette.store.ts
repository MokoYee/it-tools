import { defineStore } from 'pinia';
import _ from 'lodash';
import type { PaletteOption } from './command-palette.types';
import { useToolStore } from '@/tools/tools.store';
import { useFuzzySearch } from '@/composable/fuzzySearch';
import { useStyleStore } from '@/stores/style.store';

import SunIcon from '~icons/mdi/white-balance-sunny';
import DiceIcon from '~icons/mdi/dice-5';
import InfoIcon from '~icons/mdi/information-outline';

export const useCommandPaletteStore = defineStore('command-palette', () => {
  const toolStore = useToolStore();
  const styleStore = useStyleStore();
  const router = useRouter();
  const searchPrompt = ref('');

  const toolsOptions = toolStore.tools.map(tool => ({
    ...tool,
    to: tool.path,
    toolCategory: tool.category,
    category: '工具',
  }));

  const searchOptions: PaletteOption[] = [
    ...toolsOptions,
    {
      name: '随机工具',
      description: '从列表中随机打开一个工具。',
      action: () => {
        const { path } = _.sample(toolStore.tools)!;
        router.push(path);
      },
      icon: DiceIcon,
      category: '工具',
      keywords: ['随机', '工具', 'random', 'tool'],
      closeOnSelect: true,
    },
    {
      name: '切换深色模式',
      description: '切换深色或浅色显示模式。',
      action: () => styleStore.toggleDark(),
      icon: SunIcon,
      category: '操作',
      keywords: ['深色', '浅色', '主题', 'dark', 'theme'],
    },
    {
      name: '关于',
      description: '了解 IT-Tools。',
      to: '/about',
      category: '页面',
      keywords: ['关于', '信息', 'about', 'info'],
      icon: InfoIcon,
    },
  ];

  const { searchResult } = useFuzzySearch({
    search: searchPrompt,
    data: searchOptions,
    options: {
      keys: [{ name: 'name', weight: 2 }, 'description', 'keywords', 'category'],
      threshold: 0.3,
    },
  });

  const filteredSearchResult = computed(() =>
    _.chain(searchResult.value).groupBy('category').mapValues(categoryOptions => _.take(categoryOptions, 5)).value());

  return {
    filteredSearchResult,
    searchPrompt,
  };
});
