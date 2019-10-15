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
        {{ phrases.setDefaultsReceipts }}:&nbsp;
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
    <div style="background-color:#e6f4ff">
      <h3 style="text-align:center">{{phrases.incomeCodes}}</h3>
      <income-codes-table></income-codes-table>
    </div>

    <div>
      <h3 style="text-align:center">{{phrases.outcomeCodes}}</h3>
      <outcome-codes-table></outcome-codes-table>
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
  import IncomeCodesTable from './IncomeCodesTable'
  import OutcomeCodesTable from './OutcomeCodesTable'

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
