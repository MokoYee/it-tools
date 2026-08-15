<script setup lang="ts">
import { decodeJwt } from './jwt-parser.service';
import { useValidation } from '@/composable/validation';
import { isNotThrowing } from '@/utils/boolean';
import { withDefaultOnError } from '@/utils/defaults';

const rawJwt = ref(
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c',
);

const decodedJWT = computed(() =>
  withDefaultOnError(() => decodeJwt({ jwt: rawJwt.value }), { header: [], payload: [] }),
);
const { locale, t } = useI18n();

const sections = computed(() => [
  { key: 'header' as const, title: t('toolContent.jwt.header') },
  { key: 'payload' as const, title: t('toolContent.jwt.payload') },
]);

const validation = useValidation<string>({
  source: rawJwt,
  rules: computed(() => [
    {
      validator: value => value.length > 0 && isNotThrowing(() => decodeJwt({ jwt: rawJwt.value })),
      message: t('toolContent.jwt.invalid'),
    },
  ]),
});

function getClaimDescription(claim: string, fallback: string | undefined) {
  return locale.value === 'zh' && fallback ? t(`toolContent.jwt.claims.${claim}`) : fallback;
}

function getFriendlyValue(claim: string, value: string, fallback: string | undefined) {
  if (locale.value === 'zh' && claim === 'alg' && fallback) {
    return t(`toolContent.jwt.algorithms.${value}`);
  }

  return fallback;
}
</script>

<template>
  <c-card>
    <c-input-text v-model:value="rawJwt" :label="$t('toolContent.jwt.inputLabel')" :validation="validation" :placeholder="$t('toolContent.jwt.placeholder')" rows="5" multiline raw-text autofocus mb-3 />

    <n-table v-if="validation.isValid">
      <tbody>
        <template v-for="section of sections" :key="section.key">
          <th colspan="2" class="table-header">
            {{ section.title }}
          </th>
          <tr v-for="{ claim, claimDescription, friendlyValue, value } in decodedJWT[section.key]" :key="claim + value">
            <td class="claims" style="vertical-align: top;">
              <span font-bold>
                {{ claim }}
              </span>
              <span v-if="claimDescription" ml-2 op-70>
                ({{ getClaimDescription(claim, claimDescription) }})
              </span>
            </td>
            <td style="word-wrap: break-word;word-break: break-all;">
              <span>{{ value }}</span>
              <span v-if="friendlyValue" ml-2 op-70>
                ({{ getFriendlyValue(claim, value, friendlyValue) }})
              </span>
            </td>
          </tr>
        </template>
      </tbody>
    </n-table>
  </c-card>
</template>

<style lang="less" scoped>
.table-header {
  text-align: center;
}
</style>
