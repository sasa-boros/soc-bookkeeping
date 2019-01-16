<template>
  <b-card no-body id="appTabsCard">
    <b-tabs card>
      <b-tab :title="phrases.receipts" active class="appTab">
        <receipts-table></receipts-table>
      </b-tab>
      <b-tab :title="phrases.paymentSlips" class="appTab">
        <payment-slips-table></payment-slips-table>
      </b-tab>
      <b-tab title="Reports" class="appTab">
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
  import ReceiptsTable from './AppTabs/ReceiptsTable'
  import PaymentSlipsTable from './AppTabs/PaymentSlipsTable'
  const i18n = require('../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          receipts: i18n.getTranslation('Receipts'),
          paymentSlips: i18n.getTranslation('Payment slips')
        }
      }
    },
    components: { ReceiptsTable, PaymentSlipsTable }
  }
</script>

<style scoped>
  .appTab{
    display: block;
    overflow: auto;
  }
</style>
