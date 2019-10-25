<template>
  <b-container fluid>
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
            {{phrases.info}}  
          </template>
          <h4 align="center">Техничка подршка</h4>
          <br>
          <p align="center"><b>daxon.tech@outlook.com</b></p>
          <p align="center"><b>+381642750071</b></p>
          <br>
          <h4 align="center">Пречице</h4>
          <br>
          <p align="center">Сачувај:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{{phrases.commandOrControl}}</b> + <b>s</b></p>
          <p align="center">Обриши унето:&nbsp;&nbsp;&nbsp;&nbsp;<b>{{phrases.commandOrControl}}</b> + <b>e</b></p>
          <p align="center">Штампај:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{{phrases.commandOrControl}}</b> + <b>p</b></p>
          <p align="center">Преузми:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{{phrases.commandOrControl}}</b> + <b>d</b></p>
          <p align="center">Зумирај:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{{phrases.commandOrControl}}</b> + <b>=</b></p>
          <p align="center">Одзумирај:&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<b>{{phrases.commandOrControl}}</b> + <b>-</b></p>
          <hr>
          <br>
          <p align="center">Апликација је лиценцирана од стране агенције DAXON TECH и на њу полаже ауторска права. &copy;</p>
        </b-tab>
      </b-tabs>
      <b-modal id="app-tabs-error-modal" hide-backdrop hide-footer hide-header content-class="shadow" v-on:shown="focusModalCloseButton('appTabsErrorModal')">
          <message-confirm-dialog ref="appTabsErrorModal" parentModal="app-tabs-error-modal" type="error" :text="errorText" :cancelOkText="phrases.ok"></message-confirm-dialog>
      </b-modal>
    </b-card>
  </b-container>
</template>

<script>
  import store from '@/store'
  import ReceiptsTable from './AppTabs/ReceiptsTable'
  import PaymentSlipsTable from './AppTabs/PaymentSlipsTable'
  import AnnualReportPane from './AppTabs/AnnualReportPane'
  import SettingsPane from './AppTabs/SettingsPane'
  import MessageConfirmDialog from '../MessageConfirmDialog'

  const {webFrame} = require('electron')
  const Big = require('big.js')

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
          ok: i18n.getTranslation('Ok'),
          info: i18n.getTranslation('Information'),
          commandOrControl: 'ctrl'
        },
        arePaymentSlipsValid: true,
        areReceiptsValid: true,
        errorText: "",
        zoomLevel: Big(1.3)
      }
    },
    created () {
      this.updateInvalidPaymentSlipsInfo()
      this.updateInvalidReceiptsInfo()
      this.updateDefaultPaymentSlip();
      this.updateDefaultReceipt();
      this.updateBookedYears();
      // load zoom level
      if (process.platform == 'darwin') {
        this.phrases.commandOrControl = 'cmd'
      }
      webFrame.setZoomFactor(parseFloat(this.zoomLevel))
    },
    mounted () {
      this.bindKeys()
    },
    beforeDestroy () {
      this.unbindKeys()
    },
    watch: {
      'zoomLevel': function () {
        webFrame.setZoomFactor(parseFloat(this.zoomLevel))
      }
    },
    methods: {
      focusModalCloseButton (modalRef) {
        this.$refs[modalRef].$refs.closeButton.focus()
      },
      bindKeys() {
        const self = this
        Mousetrap.bind(['command+=', 'ctrl+='], function(e) {
          e.preventDefault()
          if(!self.zoomLevel.gte(2.0)) {
            self.zoomLevel = self.zoomLevel.plus(0.1)
          }
          return false
        });
        Mousetrap.bind(['command+-', 'ctrl+-'], function(e) {
          e.preventDefault()
          if(!self.zoomLevel.lte(1.0)) {
            self.zoomLevel = self.zoomLevel.minus(0.1)
          }
          return false
        });
        Mousetrap.prototype.stopCallback = function () {
          return false
        }
      },
      unbindKeys() {
        Mousetrap.unbind(['command+=', 'ctrl+='])
        Mousetrap.unbind(['command+-', 'ctrl+-'])
      },
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
      changeZoomLevel () {
        webFrame.setZoomFactor(parseFloat(this.zoomLevel))
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
  .input-small {
    border-style: none;
    width: 100px;
    height: 15px;
    margin: 0px;
    color: black;
  }
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