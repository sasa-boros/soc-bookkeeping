<template>
  <b-card no-body id="appTabsCard">
    <b-tabs card>
      <b-tab active class="appTab">
        <template slot="title">
          <img src="~@/assets/payment-slip.png" class="appTabsIcon">  
          {{phrases.paymentSlips}} 
          <span v-show="!arePaymentSlipsValid">
            &nbsp;
            <img id="invalidPsImg" v-on:mouseleave="hideTooltip('invalidPsImg')" src="~@/assets/invalid.png" class="invalidIcon">
            <b-tooltip target="invalidPsImg">
              <div class="tooltipInnerText">
                {{phrases.invalidPaymentSlipsExist}}
              </div>
            </b-tooltip>
          </span>
        </template>
        <payment-slips-table v-on:updateBookedYears="updateBookedYears" v-on:updateInvalidPaymentSlipsInfo="updateInvalidPaymentSlipsInfo"></payment-slips-table>
      </b-tab>
      <b-tab class="appTab">
        <template slot="title">
          <img src="~@/assets/receipt.png" class="appTabsIcon">  
          {{phrases.receipts}}
          <span v-show="!areReceiptsValid">
            &nbsp;
            <img id="invalidRImg" v-on:mouseleave="hideTooltip('invalidRImg')" src="~@/assets/invalid.png" class="invalidIcon">
            <b-tooltip target="invalidRImg">
              <div class="tooltipInnerText">
                {{phrases.invalidReceiptsExist}}
              </div>
            </b-tooltip>
          </span>
        </template>
        <receipts-table v-on:updateBookedYears="updateBookedYears" v-on:updateInvalidReceiptsInfo="updateInvalidReceiptsInfo"></receipts-table>
      </b-tab>
      <b-tab class="appTab">
        <template slot="title">
          <img src="~@/assets/annual-report.png" class="appTabsIcon">  
          {{phrases.annualReport}}
        </template>
        <annual-report-pane></annual-report-pane>
      </b-tab>
      <b-tab class="appTab">
        <template slot="title">
          <img src="~@/assets/settings.png" class="appTabsIcon">  
          {{phrases.settings}}
        </template>
        <settings-pane v-on:updateDefaultPaymentSlip="updateDefaultPaymentSlip" v-on:updateDefaultReceipt="updateDefaultReceipt"></settings-pane>
      </b-tab>
      <b-tab class="appTab">
        <template slot="title">
          <img src="~@/assets/info.png" class="appTabsIcon">  
        </template>
        <p>Техничка подршка: <b>daxon.tech@outlook.com</b>,<b> +381642750071</b></p>
        <br>
        <br>
        <p>Овај производ је лиценциран од стране агенције DAXON TECH и на њега полаже ауторска права. &copy;</p>
      </b-tab>
    </b-tabs>
    <b-modal id="app-tabs-error-modal" hide-backdrop hide-footer hide-header content-class="shadow">
        <message-confirm-dialog parentModal="app-tabs-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
    </b-modal>
  </b-card>
</template>

<script>
  import store from '@/store'
  import ReceiptsTable from './AppTabs/ReceiptsTable'
  import PaymentSlipsTable from './AppTabs/PaymentSlipsTable'
  import AnnualReportPane from './AppTabs/AnnualReportPane'
  import SettingsPane from './AppTabs/SettingsPane'
  import MessageConfirmDialog from '../MessageConfirmDialog'


  const i18n = require('../../../translations/i18n')
  const paymentSlipController = require('../../controllers/paymentSlipController')
  const receiptController = require('../../controllers/receiptController')
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
          settings: i18n.getTranslation('Settings'),
          invalidPaymentSlipsExist: i18n.getTranslation('Invalid payment slips exist'),
          invalidReceiptsExist: i18n.getTranslation('Invalid receipts exist'),
          ok: i18n.getTranslation('Ok')
        },
        arePaymentSlipsValid: true,
        areReceiptsValid: true,
        errorText: ""
      }
    },
    created () {
      this.updateInvalidPaymentSlipsInfo()
      this.updateInvalidReceiptsInfo()
      this.updateDefaultPaymentSlip();
      this.updateDefaultReceipt();
      this.updateBookedYears();
    },
    methods: {
      updateInvalidPaymentSlipsInfo () {
        const self = this
        paymentSlipController.arePaymentSlipsValid().then(function (res) {
          if (!res.err) {
            self.arePaymentSlipsValid = res.data
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      updateInvalidReceiptsInfo () {
        const self = this
        receiptController.areReceiptsValid().then(function (res) {
          if (!res.err) {
            self.areReceiptsValid = res.data
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      updateDefaultPaymentSlip () {
        const self = this
        defaultPaymentSlipController.getDefaultPaymentSlip().then(function (res) {
          if (!res.err) {
            const defaultPaymentSlip = res.data
            self.$store.dispatch('SET_DEFAULT_PAYMENT_SLIP', defaultPaymentSlip)
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      updateDefaultReceipt () {
        const self = this
        defaultReceiptController.getDefaultReceipt().then(function (res) {
          if (!res.err) {
            const defaultReceipt = res.data
            self.$store.dispatch('SET_DEFAULT_RECEIPT', defaultReceipt)
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      updateBookedYears () {
        const self = this
        commonController.getBookedYears().then(function (res) {
          if (!res.err) {
            var bookedYears = (res.data || [])
            self.$store.dispatch('SET_BOOKED_YEARS', bookedYears)
          } else {
            self.openErrorModal(res.err)
          }
        })
      },
      hideTooltip (elementId) {
        if (elementId) {
          this.$root.$emit('bv::hide::tooltip', elementId)
        } else {
          this.$root.$emit('bv::hide::tooltip')
        }
      },
      openErrorModal(error) {
        this.errorText = error
        this.$root.$emit('bv::show::modal', 'app-tabs-error-modal')
      }
    },
    components: { ReceiptsTable, PaymentSlipsTable, AnnualReportPane, SettingsPane, MessageConfirmDialog }
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