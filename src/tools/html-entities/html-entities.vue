<script setup lang="ts">
import { escape, unescape } from 'lodash';

import { useCopy } from '@/composable/copy';

const escapeInput = ref('<title>IT Tool</title>');
const escapeOutput = computed(() => escape(escapeInput.value));
const { copy: copyEscaped } = useCopy({ source: escapeOutput });

const unescapeInput = ref('&lt;title&gt;IT Tool&lt;/title&gt;');
const unescapeOutput = computed(() => unescape(unescapeInput.value));
const { copy: copyUnescaped } = useCopy({ source: unescapeOutput });
</script>

<template>
  <c-card :title="$t('toolContent.htmlEntities.escapeTitle')">
    <n-form-item :label="$t('toolContent.htmlEntities.inputLabel')">
      <c-input-text
        v-model:value="escapeInput"
        multiline
        :placeholder="$t('toolContent.htmlEntities.escapePlaceholder')"
        rows="3"
        autosize
        raw-text
      />
    </n-form-item>

    <n-form-item :label="$t('toolContent.htmlEntities.escapedLabel')">
      <c-input-text
        multiline
        readonly
        :placeholder="$t('toolContent.htmlEntities.escapedPlaceholder')"
        :value="escapeOutput"
        rows="3"
        autosize
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyEscaped()">
        {{ $t('toolContent.htmlEntities.copy') }}
      </c-button>
    </div>
  </c-card>
  <c-card :title="$t('toolContent.htmlEntities.unescapeTitle')">
    <n-form-item :label="$t('toolContent.htmlEntities.escapedInputLabel')">
      <c-input-text
        v-model:value="unescapeInput"
        multiline
        :placeholder="$t('toolContent.htmlEntities.unescapePlaceholder')"
        rows="3"
        autosize
        raw-text
      />
    </n-form-item>

    <n-form-item :label="$t('toolContent.htmlEntities.unescapedLabel')">
      <c-input-text
        :value="unescapeOutput"
        multiline
        readonly
        :placeholder="$t('toolContent.htmlEntities.unescapedPlaceholder')"
        rows="3"
        autosize
      />
    </n-form-item>

    <div flex justify-center>
      <c-button @click="copyUnescaped()">
        {{ $t('toolContent.htmlEntities.copy') }}
      </c-button>
    </div>
  </c-card>
</template>
