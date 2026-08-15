<script setup lang="ts">
import { useEventListener } from '@vueuse/core';

import InputCopyable from '../../components/InputCopyable.vue';

const event = ref<KeyboardEvent>();
const { t } = useI18n();

useEventListener(document, 'keydown', (e) => {
  event.value = e;
});

const fields = computed(() => {
  if (!event.value) {
    return [];
  }

  return [
    {
      label: t('toolContent.keycode.key'),
      value: event.value.key,
      placeholder: t('toolContent.keycode.keyPlaceholder'),
    },
    {
      label: t('toolContent.keycode.keycode'),
      value: String(event.value.keyCode),
      placeholder: 'Keycode...',
    },
    {
      label: t('toolContent.keycode.code'),
      value: event.value.code,
      placeholder: 'Code...',
    },
    {
      label: t('toolContent.keycode.location'),
      value: String(event.value.location),
      placeholder: 'Code...',
    },

    {
      label: t('toolContent.keycode.modifiers'),
      value: [
        event.value.metaKey && 'Meta',
        event.value.shiftKey && 'Shift',
        event.value.ctrlKey && 'Ctrl',
        event.value.altKey && 'Alt',
      ]
        .filter(Boolean)
        .join(' + '),
      placeholder: t('toolContent.keycode.none'),
    },
  ];
});
</script>

<template>
  <div>
    <c-card mb-5 text-center important:py-12>
      <div v-if="event" mb-2 text-3xl>
        {{ event.key }}
      </div>
      <span lh-1 op-70>
        {{ $t('toolContent.keycode.instruction') }}
      </span>
    </c-card>

    <n-input-group v-for="({ label, value, placeholder }, i) of fields" :key="i" style="margin-bottom: 5px">
      <n-input-group-label style="flex: 0 0 150px">
        {{ label }}
      </n-input-group-label>
      <InputCopyable :value="value" readonly :placeholder="placeholder" />
    </n-input-group>
  </div>
</template>
