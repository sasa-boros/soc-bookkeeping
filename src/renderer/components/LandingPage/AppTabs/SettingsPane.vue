<template>
  <b-container fluid>
    <b-row>
      <b-col cols="8">
        {{ phrases.setDefaultPaymentSlip }}:
      </b-col>
      <b-col cols="4">
        <b-btn id="defaultPaymentSlipBtn" @click.stop="openDefaultPaymentSlipModal()">
          <img src="~@/assets/payment-slip-blue.png" class="icon">
        </b-btn>
      </b-col>
    </b-row>
    <br>
    <b-row>
      <b-col cols="8">
        {{ phrases.setDefaultsReceipts }}:
      </b-col>
      <b-col cols="4">      
        <b-btn id="defaultReceiptBtn" @click.stop="openDefaultReceiptModal()">
          <img src="~@/assets/receipt-blue.png" class="icon">
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

    <h3>{{phrases.incomeCodes}}</h3>
    <hr>
    <income-codes-table></income-codes-table>

    <h3>{{phrases.outcomeCodes}}</h3>
    <hr>
    <outcome-codes-table></outcome-codes-table>

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
  import IncomeCodesTable from './IncomeCodesTable'
  import OutcomeCodesTable from './OutcomeCodesTable'

  const i18n = require('../../../translations/i18n')

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
        this.$root.$emit('bv::show::modal', 'default-payment-slip-modal')
      },
      openDefaultReceiptModal () {
        this.$root.$emit('bv::show::modal', 'default-receipt-modal')
      }
    },
    components: { PaymentSlipPreview, ReceiptPreview, IncomeCodesTable, OutcomeCodesTable }
  }
</script>



<style scoped>
  .tooltipInnerText {
    font-size: 95%;
    line-height: 1;
    margin: 1px;
  }
 .icon {
    height: 28px;
    width: auto;
    margin-right: 5px;
  }
</style>