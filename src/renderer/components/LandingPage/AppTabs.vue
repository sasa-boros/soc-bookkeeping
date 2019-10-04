<template>
  <b-card no-body id="appTabsCard">
    <b-tabs card>
      <b-tab active class="appTab">
        <template slot="title">
          <img src="~@/assets/payment-slip-blue.png" class="appTabsIcon">  {{phrases.paymentSlips}}
        </template>
        <payment-slips-table v-on:updateYearOptions="updateYearOptions"></payment-slips-table>
      </b-tab>
      <b-tab class="appTab">
        <template slot="title">
          <img src="~@/assets/receipt-blue.png" class="appTabsIcon">  {{phrases.receipts}}
        </template>
        <receipts-table v-on:updateYearOptions="updateYearOptions"></receipts-table>
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
        <settings-pane v-on:updateDefaultPaymentSlip="updateDefaultPaymentSlip" v-on:updateDefaultReceipt="updateDefaultReceipt"></settings-pane>
      </b-tab>
    </b-tabs>
  </b-card>
</template>

<script>
  import store from '@/store'
  import ReceiptsTable from './AppTabs/ReceiptsTable'
  import PaymentSlipsTable from './AppTabs/PaymentSlipsTable'
  import AnnualReportPane from './AppTabs/AnnualReportPane'
  import SettingsPane from './AppTabs/SettingsPane'
  const i18n = require('../../translations/i18n')
  const defaultPaymentSlipController = require('../../controllers/defaultPaymentSlipController')
  const defaultReceiptController = require('../../controllers/defaultReceiptController')
  const commonController = require('../../controllers/commonController')

  export default {
    data () {
      return {
        phrases: {
          paymentSlips: i18n.getTranslation('Payment slips'),
          receipts: i18n.getTranslation('Receipts'),
          annualReport: i18n.getTranslation('Annual report'),
          settings: i18n.getTranslation('Settings')
        }
      }
    },
    created () {
      this.updateDefaultPaymentSlip();
      this.updateDefaultReceipt();
      this.updateYearOptions();
    },
    methods: {
      updateDefaultPaymentSlip() {
        const self = this
        defaultPaymentSlipController.getDefaultPaymentSlip().then(function (res) {
          if (!res.err) {
            const defaultPaymentSlip = res.data
            self.$store.dispatch('SET_DEFAULT_PAYMENT_SLIP', defaultPaymentSlip)
          } else {
            showErrorDialog(res.err)
          }
        })
      },
      updateDefaultReceipt() {
        const self = this
        defaultReceiptController.getDefaultReceipt().then(function (res) {
          if (!res.err) {
            const defaultReceipt = res.data
            self.$store.dispatch('SET_DEFAULT_RECEIPT', defaultReceipt)
          } else {
            showErrorDialog(res.err)
          }
        })
      },
      updateYearOptions() {
        const self = this
        commonController.getBookedYears().then(function (res) {
          if (!res.err) {
            var yearsBooked = (res.data || [])
            yearsBooked.unshift('')
            self.$store.dispatch('SET_YEAR_OPTIONS', yearsBooked)
          } else {
            showErrorDialog(res.err)
          }
        })
      }
    },
    components: { ReceiptsTable, PaymentSlipsTable, AnnualReportPane, SettingsPane }
  }
</script>

<style scoped>
  .appTab {
    display: block;
    overflow: auto;
  }
  .appTabsIcon {
    height: 28px;
    width: auto;
    margin-right: 5px;
  }
</style>
