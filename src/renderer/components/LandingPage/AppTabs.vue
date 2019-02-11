<template>
  <b-card no-body id="appTabsCard">
    <b-tabs card>
      <b-tab active class="appTab">
        <template slot="title">
          <img src="~@/assets/income-blue.png" class="appTabsIcon">  {{phrases.receipts}}
        </template>
        <receipts-table></receipts-table>
      </b-tab>
      <b-tab class="appTab">
        <template slot="title">
          <img src="~@/assets/outcome-blue.png" class="appTabsIcon">  {{phrases.paymentSlips}}
        </template>
        <payment-slips-table></payment-slips-table>
      </b-tab>
      <b-tab class="appTab">
        <template slot="title">
          <img src="~@/assets/report-blue.png" class="appTabsIcon">  {{phrases.annualReport}}
        </template>
        <annual-report-pane></annual-report-pane>
      </b-tab>
      <b-tab class="appTab">
        <template slot="title">
          <img src="~@/assets/settings-blue.png" class="appTabsIcon">  {{phrases.settings}}
        </template>
        <settings-pane></settings-pane>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
  import ReceiptsTable from './AppTabs/ReceiptsTable'
  import PaymentSlipsTable from './AppTabs/PaymentSlipsTable'
  import AnnualReportPane from './AppTabs/AnnualReportPane'
  import SettingsPane from './AppTabs/SettingsPane'
  const i18n = require('../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          receipts: i18n.getTranslation('Receipts'),
          paymentSlips: i18n.getTranslation('Payment slips'),
          annualReport: i18n.getTranslation('Annual report'),
          settings: i18n.getTranslation('Settings')
        }
      }
    },
    components: { ReceiptsTable, PaymentSlipsTable, AnnualReportPane, SettingsPane }
  }
</script>

<style scoped>
  .appTab{
    display: block;
    overflow: auto;
  }
  .appTabsIcon{
    height: 28px;
    width: auto;
    margin-right: 5px;
  }
</style>
