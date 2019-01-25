<template>
  <b-container fluid> 
    <b-btn @click.stop="openDefaultReceiptModal()">
      {{ phrases.setDefaultsReceipts }}           
    </b-btn>
    <b-btn @click.stop="openDefaultPaymentSlipModal()">
      {{ phrases.setDefaultPaymentSlip }}             
    </b-btn>

    <!-- Default receipt modal -->
    <b-modal hide-footer hide-header size="a5" id="modalDefaultReceipt">
      <receipt-preview :item='defaultReceiptItem'></receipt-preview>
    </b-modal>

    <!-- Default slip modal -->
    <b-modal hide-footer hide-header size="a5" id="modalDefaultSlip">
      <payment-slip-preview :item='defaultPaymentSlipItem' parentModal="modalDefaultSlip" defaultPaymentSlip></payment-slip-preview>
    </b-modal>
  </b-container>
</template>

<script>
  import PaymentSlipPreview from './PaymentSlipsTable/PaymentSlipPreview'
  import ReceiptPreview from './ReceiptsTable/ReceiptPreview'

  const i18n = require('../../../translations/i18n')
  const defaultValues = require('../../../utils/defaultValues')

  export default {
    data () {
      return {
        defaultPaymentSlipItem: null,
        defaultReceiptItem: null,
        phrases: {
          setDefaultPaymentSlip: i18n.getTranslation('Set default values for payment slips'),
          setDefaultsReceipts: i18n.getTranslation('Set default values for receipts')
        }
      }
    },
    created () {
      this.defaultPaymentSlipItem = JSON.parse(JSON.stringify(defaultValues.getDefaultPaymentSlip()))
      this.defaultReceiptItem = JSON.parse(JSON.stringify(defaultValues.getDefaultReceipt()))
    },
    methods: {
      openDefaultReceiptModal: function () {
        this.$root.$emit('bv::show::modal', 'modalDefaultReceipt')
      },
      openDefaultPaymentSlipModal: function () {
        this.$root.$emit('bv::show::modal', 'modalDefaultSlip')
      }
    },
    components: { PaymentSlipPreview, ReceiptPreview }
  }
</script>

<style scoped>
#yearSelect{
  width: 95px;
  padding-left:5px;
  margin-bottom: 8px;
}
</style>