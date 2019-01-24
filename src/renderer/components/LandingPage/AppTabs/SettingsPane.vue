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
      <payment-slip-preview :item='defaultPaymentSlipItem'></payment-slip-preview>
    </b-modal>
  </b-container>
</template>

<script>
  import PaymentSlipPreview from './PaymentSlipsTable/PaymentSlipPreview'
  import ReceiptPreview from './ReceiptsTable/ReceiptPreview'

  const i18n = require('../../../translations/i18n')
  // const paymentSlipsController = require('../../../controllers/paymentSlip.controller')
  // const receiptsController = require('../../../controllers/receipt.controller')

  export default {
    data () {
      return {
        defaultPaymentSlipItem: {
          amount: null,
          reason: null,
          town: null,
          amountText: null,
          payed: null,
          received: null,
          firstPart: '',
          firstPos: '',
          firstAmount: null,
          secondPart: '',
          secondPos: '',
          secondAmount: null,
          municipalityPresident: null,
          date: null,
          created_at: null,
          updated_at: null,
          ordinal: null,
          annualReportPage: null
        }, // paymentSlipsController.
        defaultReceiptItem: {
          amount: null,
          reason: null,
          town: null,
          amountText: null,
          payed: null,
          received: null,
          firstPart: '',
          firstPos: '',
          firstAmount: null,
          secondPart: '',
          secondPos: '',
          secondAmount: null,
          municipalityPresident: null,
          date: null,
          created_at: null,
          updated_at: null,
          ordinal: null,
          annualReportPage: null
        }, // receiptsController.
        phrases: {
          setDefaultPaymentSlip: i18n.getTranslation('Set default values for payment slips'),
          setDefaultsReceipts: i18n.getTranslation('Set default values for receipts')
        }
      }
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