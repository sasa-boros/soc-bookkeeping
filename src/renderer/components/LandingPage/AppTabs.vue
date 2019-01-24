<template>
  <b-card no-body id="appTabsCard">
    <b-tabs card>
      <b-tab active class="appTab">
        <template slot="title">
          <img src="~@/assets/income-blue.png">  {{phrases.receipts}}
        </template>
        <receipts-table></receipts-table>
      </b-tab>
      <b-tab class="appTab">
        <template slot="title">
          <img src="~@/assets/outcome-blue.png">  {{phrases.paymentSlips}}
        </template>
        <payment-slips-table></payment-slips-table>
      </b-tab>
      <b-tab :title="phrases.reports" class="appTab">
        <reports-pane></reports-pane>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
  import ReceiptsTable from './AppTabs/ReceiptsTable'
  import PaymentSlipsTable from './AppTabs/PaymentSlipsTable'
  import ReportsPane from './AppTabs/ReportsPane'
  const i18n = require('../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          receipts: i18n.getTranslation('Receipts'),
          paymentSlips: i18n.getTranslation('Payment slips'),
          reports: i18n.getTranslation('Reports')
        }
      }
    },
    components: { ReceiptsTable, PaymentSlipsTable, ReportsPane }
  }
</script>

<style scoped>
  .appTab{
    display: block;
    overflow: auto;
  }
</style>
