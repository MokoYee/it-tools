import { Hierarchy2 } from '@vicons/tabler';
import { defineTool } from '../tool';
import { translate } from '@/plugins/i18n.plugin';

export const tool = defineTool({
  name: translate('tools.jsonpath-extractor.title'),
  path: '/jsonpath-extractor',
  description: translate('tools.jsonpath-extractor.description'),
  keywords: ['json', 'jsonpath', 'query', 'extract', 'filter'],
  component: () => import('./jsonpath-extractor.vue'),
  icon: Hierarchy2,
  createdAt: new Date('2026-08-16'),
});
