// eslint-disable-next-line no-restricted-imports
import { useClipboard } from '@vueuse/core';
import { useMessage } from 'naive-ui';
import { type MaybeRefOrGetter, toValue } from 'vue';

export function useCopy({ source, text, createToast = true }: { source?: MaybeRefOrGetter<string>; text?: MaybeRefOrGetter<string>; createToast?: boolean } = {}) {
  const { copy, copied, ...rest } = useClipboard({
    source,
    legacy: true,
  });

  const message = useMessage();
  const { t } = useI18n();

  return {
    ...rest,
    isJustCopied: copied,
    async copy(content?: string, { notificationMessage }: { notificationMessage?: string } = {}) {
      if (source) {
        await copy();
      }
      else {
        await copy(content);
      }

      if (createToast) {
        message.success(notificationMessage ?? toValue(text) ?? t('common.copiedToClipboard'));
      }
    },
  };
}
