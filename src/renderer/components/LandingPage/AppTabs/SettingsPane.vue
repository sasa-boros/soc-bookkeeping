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
      <receipt-preview :item='defaultReceiptForm' parentModal="modalDefaultReceipt" defaultReceiptPreview></receipt-preview>
    </b-modal>

    <!-- Default slip modal -->
    <b-modal hide-footer hide-header size="a5" id="modalDefaultSlip">
      <payment-slip-preview :item='defaultPaymentSlipForm' parentModal="modalDefaultSlip" defaultPaymentSlipPreview></payment-slip-preview>
    </b-modal>
  </b-container>
</template>

<script>
  import { mapState } from 'vuex'
  import PaymentSlipPreview from './PaymentSlipsTable/PaymentSlipPreview'
  import ReceiptPreview from './ReceiptsTable/ReceiptPreview'

  const i18n = require('../../../translations/i18n')

  export default {
    data () {
      return {
        phrases: {
          setDefaultPaymentSlip: i18n.getTranslation('Set default values for payment slips'),
          setDefaultsReceipts: i18n.getTranslation('Set default values for receipts')
        }
      }
    },
    computed: {
      ...mapState(
        {
          defaultPaymentSlip: state => state.DefaultValues.defaultPaymentSlip,
          defaultReceipt: state => state.DefaultValues.defaultReceipt
        }
      ),
      defaultPaymentSlipForm () {
        return JSON.parse(JSON.stringify(this.defaultPaymentSlip))
      },
      defaultReceiptForm () {
        return JSON.parse(JSON.stringify(this.defaultReceipt))
      }
    },
    created () {
      this.$store.dispatch('LOAD_DEFAULT_PAYMENT_SLIP')
      this.$store.dispatch('LOAD_DEFAULT_RECEIPT')
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
</style>