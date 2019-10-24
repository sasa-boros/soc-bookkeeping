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
    <hr>
    <b-row>
      <b-col>
        {{ phrases.setDefaultsReceipts }}:&nbsp;&nbsp;
        <b-btn id="defaultReceiptBtn" v-on:mouseleave="hideTooltip('defaultReceiptBtn')" @click.stop="openDefaultReceiptModal()" variant="light" class="btn-lg">
          <img src="~@/assets/receipt.png">
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
    <br>
    <div class="incomeCodesTable">
      <h3 class="codeHeader">{{phrases.incomeCodes}}</h3>
      <p class="codeSubHeader">{{phrases.addedCodesAutomaticallySortedByPartPos}}</p>
      <income-codes-table v-on:updateDefaultPaymentSlip="updateDefaultPaymentSlip"></income-codes-table>
    </div>
    <br>
    <div>
      <h3 class="codeHeader">{{phrases.outcomeCodes}}</h3>
      <p class="codeSubHeader">{{phrases.addedCodesAutomaticallySortedByPartPos}}</p>
      <outcome-codes-table v-on:updateDefaultReceipt="updateDefaultReceipt"></outcome-codes-table>
    </div>

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

  </b-container>
</template>

<script>
  import PaymentSlipPreview from './PaymentSlipsTable/PaymentSlipPreview'
  import ReceiptPreview from './ReceiptsTable/ReceiptPreview'
  import IncomeCodesTable from './SettingsPane/IncomeCodesTable'
  import OutcomeCodesTable from './SettingsPane/OutcomeCodesTable'

  const i18n = require('../../../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          setDefaultPaymentSlip: i18n.getTranslation('Set default values for payment slips'),
          setDefaultsReceipts: i18n.getTranslation('Set default values for receipts'),
          adaptPaymentSlips: i18n.getTranslation('Adapt payment slips'),
          adaptReceipts: i18n.getTranslation('Adapt receipts'),
          incomeCodes: i18n.getTranslation('Income codes'),
          outcomeCodes: i18n.getTranslation('Outcome codes'),
          addedCodesAutomaticallySortedByPartPos: i18n.getTranslation('Added codes are being sorted automatically by partition and position')
        }
      }
    },
    created () {
      const self = this;
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
      hideTooltip (elementId) {
        if (elementId) {
          this.$root.$emit('bv::hide::tooltip', elementId)
        } else {
          this.$root.$emit('bv::hide::tooltip')
        }
      }
    },
    components: { PaymentSlipPreview, ReceiptPreview, IncomeCodesTable, OutcomeCodesTable }
  }
</script>

<style scoped>
  .incomeCodesTable {
    background-color:#e6f4ff; 
    overflow:auto;
  }
  .codeHeader {
    text-align: center;
  }
  .codeSubHeader {
    text-align: center;
    font-size: 9.0pt;
    color: #8e8e8e;
  }
</style>
