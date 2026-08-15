<script setup lang="ts">
import { generateMeta } from '@it-tools/oggen';
import _ from 'lodash';
import type { SelectGroupOption, SelectOption } from 'naive-ui';
import { image, ogSchemas, twitter, website } from './og-schemas';
import type { OGSchemaType, OGSchemaTypeElementSelect } from './OGSchemaType.type';
import TextareaCopyable from '@/components/TextareaCopyable.vue';

// Since type guards do not work in template

const metadata = ref<{ type: string; [k: string]: any }>({
  'type': 'website',
  'twitter:card': 'summary_large_image',
});

const { locale, t } = useI18n();

const sectionKeys: Record<string, string> = {
  'General information': 'general',
  'Image': 'image',
  'Twitter': 'twitter',
  'Song details': 'song',
  'Album details': 'album',
  'Playlist details': 'playlist',
  'Radio station details': 'radioStation',
  'Movie details': 'movie',
  'Video episode details': 'episode',
  'TV show details': 'tvShow',
  'Other video details': 'otherVideo',
  'Profile': 'profile',
  'Article': 'article',
  'Book': 'book',
};

function normalizeTranslationKey(value: string) {
  return value.replace(/[:.]/g, '_').toLowerCase();
}

function localizeOptions(options: Array<SelectOption | SelectGroupOption>): Array<SelectOption | SelectGroupOption> {
  return options.map((option) => {
    if (option.type === 'group') {
      const children = option.children as SelectOption[];

      return {
        ...option,
        label: t(`toolContent.meta.optionGroups.${normalizeTranslationKey(String(option.key))}`),
        children: children.map(child => ({
          ...child,
          label: t(`toolContent.meta.options.${normalizeTranslationKey(String(child.value))}`),
        })),
      };
    }

    return {
      ...option,
      label: t(`toolContent.meta.options.${normalizeTranslationKey(String(option.value))}`),
    };
  }) as Array<SelectOption | SelectGroupOption>;
}

watch(
  () => ref(metadata.value.type),
  (_ignored, prevSection) => {
    const section = ogSchemas[prevSection.value];

    if (!section) {
      return;
    }

    section.elements.forEach(({ key }) => {
      metadata.value[key] = '';
    });
  },
);

const sections = computed(() => {
  const secs: OGSchemaType[] = [website, image, twitter];
  const additionalSchema = ogSchemas[metadata.value.type];

  if (additionalSchema) {
    secs.push(additionalSchema);
  }

  return secs;
});

const localizedSections = computed(() => {
  if (locale.value !== 'zh') {
    return sections.value;
  }

  return sections.value.map(section => ({
    ...section,
    name: t(`toolContent.meta.sections.${sectionKeys[section.name]}`),
    elements: section.elements.map((element) => {
      const fieldKey = normalizeTranslationKey(element.key);

      return {
        ...element,
        label: t(`toolContent.meta.fields.${fieldKey}.label`),
        placeholder: t(`toolContent.meta.fields.${fieldKey}.placeholder`),
        ...(element.type === 'select' ? { options: localizeOptions(element.options) } : {}),
      };
    }),
  }));
});

const metaTags = computed(() => {
  const twitterMeta = _.chain(metadata.value)
    .pickBy((_value, k) => k.startsWith('twitter:'))
    .mapKeys((_value, k) => k.replace(/^twitter:/, ''))
    .value();

  const otherMeta = _.pickBy(metadata.value, (_value, k) => !k.startsWith('twitter:'));

  return generateMeta({ ...otherMeta, twitter: twitterMeta }, { generateTwitterCompatibleMeta: true });
});
</script>

<template>
  <div>
    <div v-for="{ name, elements } of localizedSections" :key="name" style="margin-bottom: 15px">
      <div mb-5px>
        {{ name }}
      </div>

      <n-input-group v-for="{ key, type, label, placeholder, ...element } of elements" :key="key">
        <n-input-group-label style="flex: 0 0 110px">
          {{ label }}
        </n-input-group-label>

        <c-input-text v-if="type === 'input'" v-model:value="metadata[key]" :placeholder="placeholder" clearable />
        <n-dynamic-input
          v-else-if="type === 'input-multiple'"
          v-model:value="metadata[key]"
          :min="1"
          :placeholder="placeholder"
          :default-value="['']"
          :show-sort-button="true"
        />

        <c-select
          v-else-if="type === 'select'"
          v-model:value="metadata[key]"
          w-full
          :placeholder="placeholder"
          :options="(element as OGSchemaTypeElementSelect).options"
        />
      </n-input-group>
    </div>
  </div>
  <div>
    <n-form-item :label="$t('toolContent.meta.outputLabel')">
      <TextareaCopyable :value="metaTags" language="html" />
    </n-form-item>
  </div>
</template>

<style lang="less" scoped>
.n-input-group {
  margin-bottom: 5px;
}

::v-deep(.n-form-item-blank) {
  min-height: 0 !important;
}
::v-deep(.n-dynamic-input-item) {
  margin-bottom: 5px;
}
</style>
