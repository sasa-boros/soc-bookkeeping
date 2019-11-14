<template>
  <b-container fluid>
    <br>
    <b-row>
      <b-col>
        {{ phrases.setDefaultPaymentSlip }}:&nbsp;&nbsp;&nbsp;&nbsp;
        <b-btn id="defaultPaymentSlipBtn" v-on:mouseleave="hideTooltip('defaultPaymentSlipBtn')" @click.stop="openDefaultPaymentSlipModal()" variant="light" class="btn-lg">
          <img src="~@/assets/payment-slip.png">
        </b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        {{ phrases.setDefaultsReceipt }}:&nbsp;&nbsp;
        <b-btn id="defaultReceiptBtn" v-on:mouseleave="hideTooltip('defaultReceiptBtn')" @click.stop="openDefaultReceiptModal()" variant="light" class="btn-lg">
          <img src="~@/assets/receipt.png">
        </b-btn>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        {{ phrases.setDefaultZoomLevel }}:&nbsp;&nbsp; 
        <b-btn id="decreaseZoomLevelButton" v-on:mouseleave="hideTooltip('decreaseZoomLevelButton')" @click.stop="decreaseZoomLevel()" variant="link" class="btn-lg">
          <img src="~@/assets/minus.png">
        </b-btn>
        {{ zoomLevelFormated }}
        <b-btn id="increaseZoomLevelButton" v-on:mouseleave="hideTooltip('increaseZoomLevelButton')" @click.stop="increaseZoomLevel()" variant="link" class="btn-lg">
          <img src="~@/assets/plus.png">
        </b-btn>
      </b-col>
    </b-row>

    <!-- Default slip modal -->
    <b-modal hide-footer hide-header size="a5" id="default-payment-slip-modal">
      <payment-slip-preview parentModal="default-payment-slip-modal" :defaultPaymentSlipPreview='true' v-on:updateDefaultPaymentSlip="updateDefaultPaymentSlip"></payment-slip-preview>
    </b-modal>

    <!-- Default receipt modal -->
    <b-modal hide-footer hide-header size="a5" id="default-receipt-modal">
      <receipt-preview parentModal="default-receipt-modal" :defaultReceiptPreview='true' v-on:updateDefaultReceipt="updateDefaultReceipt"></receipt-preview>
    </b-modal>

    <b-tooltip target="defaultPaymentSlipBtn" triggers="hover" placement="top" ref="defaultPaymentSlipBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.adaptPaymentSlips}}
      </div>
    </b-tooltip>

    <b-tooltip target="defaultReceiptBtn" triggers="hover" placement="top" ref="defaultReceiptBtnTooltip">
      <div class="tooltipInnerText">
        {{phrases.adaptReceipts}}
      </div>
    </b-tooltip>

    <b-tooltip target="increaseZoomLevelButton" triggers="hover" placement="top" ref="increaseZoomLevelButtonTooltip">
      <div class="tooltipInnerText">
        {{phrases.increase}}
      </div>
    </b-tooltip>

    <b-tooltip target="decreaseZoomLevelButton" triggers="hover" placement="top" ref="decreaseZoomLevelButtonTooltip">
      <div class="tooltipInnerText">
        {{phrases.decrease}}
      </div>
    </b-tooltip>
  </b-container>
</template>

<script>
  import PaymentSlipPreview from './PaymentSlipsPane/PaymentSlipPreview'
  import ReceiptPreview from './ReceiptsPane/ReceiptPreview'

  const Big = require('big.js')
  const i18n = require('../../../../translations/i18n')
  const settingsController = require('../../../controllers/settingsController')

  export default {
    data () {
      return {
        phrases: {
          setDefaultPaymentSlip: i18n.getTranslation('Default values for payment slips'),
          setDefaultsReceipt: i18n.getTranslation('Default values for receipts'),
          setDefaultZoomLevel: i18n.getTranslation('Default zoom level'),
          adaptPaymentSlips: i18n.getTranslation('Adapt payment slips'),
          adaptReceipts: i18n.getTranslation('Adapt receipts'),
          increase: i18n.getTranslation('Increase'),
          decrease: i18n.getTranslation('Decrease')
        },
        zoomLevel: Big(1.5)
      }
    },
    created () {
      const self = this
      settingsController.getSettings().then(function (res) {
        if (!res.err) {
          self.zoomLevel = Big(res.data && res.data.zoomLevel ? res.data.zoomLevel : 1.5)
          self.updateZoomLevel()
        } else {
          self.openErrorModal(res.err)
        }
      })
    },
    computed: {
      zoomLevelFormated: function() {
        if(!this.zoomLevel) {
          return null;
        }
        var formatedZoomLevel = this.zoomLevel.times(100).minus(50)
        return formatedZoomLevel.toString() + ' %'
      }
    },
    methods: {
      updateDefaultPaymentSlip () {
        this.$emit('updateDefaultPaymentSlip')
      },
      updateDefaultReceipt () {
        this.$emit('updateDefaultReceipt')
      },
      openDefaultPaymentSlipModal () {
        this.hideTooltip('defaultPaymentSlipBtn')
        this.$root.$emit('bv::show::modal', 'default-payment-slip-modal')
      },
      openDefaultReceiptModal () {
        this.hideTooltip('defaultReceiptBtn')
        this.$root.$emit('bv::show::modal', 'default-receipt-modal')
      },
      increaseZoomLevel () {
        if(!this.zoomLevel.gte(2.0)) {
          this.zoomLevel = this.zoomLevel.plus(0.1)
        }
        this.updateZoomLevel()
      },
      decreaseZoomLevel () {
        if(!this.zoomLevel.lte(1.0)) {
          this.zoomLevel = this.zoomLevel.minus(0.1)
        }
        this.updateZoomLevel()
      },
      updateZoomLevel () {
        const self = this
        settingsController.createSettings({zoomLevel: parseFloat(self.zoomLevel)}).then(function (res) {
          if (!res.err) {
            self.$emit('updateZoomLevel', parseFloat(self.zoomLevel))
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
      }
    },
    components: { PaymentSlipPreview, ReceiptPreview }
  }
</script>

<style scoped>
  #zoomLevelInput {
    width: 60px;
  }
  .input-small {
    border-style: none;
    font-weight: bold;
    display: inline;
    height: 15px;
    margin: 0px;
    color: black;
  }
  input {
    /* Immitate the underline in the real payment slip */
    border-bottom: .5pt solid black !important;
    border-radius: 0 !important;
    text-align:center;
    font-family: "Times New Roman";
    font-size: 90%;
    letter-spacing: 95%;
  }
</style>
