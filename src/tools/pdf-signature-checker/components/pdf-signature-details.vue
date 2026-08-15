<script setup lang="ts">
import type { SignatureInfo } from '../pdf-signature-checker.types';

const props = defineProps<{ signature: SignatureInfo }>();
const { signature } = toRefs(props);
const { locale, t } = useI18n();

const tableHeaders = computed(() => ({
  validityPeriod: t('toolContent.pdf.validityPeriod'),
  issuedBy: t('toolContent.pdf.issuedBy'),
  issuedTo: t('toolContent.pdf.issuedTo'),
  pemCertificate: t('toolContent.pdf.pemCertificate'),
}));

const certs = computed(() => signature.value.meta.certs.map((certificate, index) => ({
  ...certificate,
  validityPeriod: {
    notBefore: new Date(certificate.validityPeriod.notBefore).toLocaleString(locale.value),
    notAfter: new Date(certificate.validityPeriod.notAfter).toLocaleString(locale.value),
  },
  certificateName: t('toolContent.pdf.certificate', { index: index + 1 }),
})),
);
</script>

<template>
  <div flex flex-col gap-2>
    <c-table :data="certs" :headers="tableHeaders">
      <template #validityPeriod="{ value }">
        <c-key-value-list
          :items="[{
            label: $t('toolContent.pdf.notBefore'),
            value: value.notBefore,
          }, {
            label: $t('toolContent.pdf.notAfter'),
            value: value.notAfter,
          }]"
        />
      </template>

      <template #issuedBy="{ value }">
        <c-key-value-list
          :items="[{
            label: $t('toolContent.pdf.commonName'),
            value: value.commonName,
          }, {
            label: $t('toolContent.pdf.organizationName'),
            value: value.organizationName,
          }, {
            label: $t('toolContent.pdf.countryName'),
            value: value.countryName,
          }, {
            label: $t('toolContent.pdf.localityName'),
            value: value.localityName,
          }, {
            label: $t('toolContent.pdf.organizationalUnitName'),
            value: value.organizationalUnitName,
          }, {
            label: $t('toolContent.pdf.stateName'),
            value: value.stateOrProvinceName,
          }]"
        />
      </template>

      <template #issuedTo="{ value }">
        <c-key-value-list
          :items="[{
            label: $t('toolContent.pdf.commonName'),
            value: value.commonName,
          }, {
            label: $t('toolContent.pdf.organizationName'),
            value: value.organizationName,
          }, {
            label: $t('toolContent.pdf.countryName'),
            value: value.countryName,
          }, {
            label: $t('toolContent.pdf.localityName'),
            value: value.localityName,
          }, {
            label: $t('toolContent.pdf.organizationalUnitName'),
            value: value.organizationalUnitName,
          }, {
            label: $t('toolContent.pdf.stateName'),
            value: value.stateOrProvinceName,
          }]"
        />
      </template>

      <template #pemCertificate="{ value }">
        <c-modal-value :value="value" :label="$t('toolContent.pdf.viewPem')">
          <template #value>
            <div break-all text-xs>
              {{ value }}
            </div>
          </template>
        </c-modal-value>
      </template>
    </c-table>
  </div>
</template>
