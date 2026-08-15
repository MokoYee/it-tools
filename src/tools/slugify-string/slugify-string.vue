<script setup lang="ts">
import slugify from '@sindresorhus/slugify';
import { withDefaultOnError } from '@/utils/defaults';
import { useCopy } from '@/composable/copy';

const input = ref('');
const slug = computed(() => withDefaultOnError(() => slugify(input.value), ''));
const { t } = useI18n();
const { copy } = useCopy({ source: slug, text: () => t('toolContent.slug.copied') });
</script>

<template>
  <div>
    <c-input-text v-model:value="input" multiline :placeholder="$t('toolContent.slug.inputPlaceholder')" :label="$t('toolContent.slug.inputLabel')" autofocus raw-text mb-5 />

    <c-input-text :value="slug" multiline readonly :placeholder="$t('toolContent.slug.outputPlaceholder')" :label="$t('toolContent.slug.outputLabel')" mb-5 />

    <div flex justify-center>
      <c-button :disabled="slug.length === 0" @click="copy()">
        {{ $t('toolContent.slug.copy') }}
      </c-button>
    </div>
  </div>
</template>
