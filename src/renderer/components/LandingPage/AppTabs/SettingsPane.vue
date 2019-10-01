<template>
  <b-container fluid>
    <b-btn @click.stop="openDefaultReceiptModal()">
      {{ phrases.setDefaultsReceipts }}           
    </b-btn>
    <b-btn @click.stop="openDefaultPaymentSlipModal()">
      {{ phrases.setDefaultPaymentSlip }}             
    </b-btn>

    <!-- Default receipt modal -->
    <b-modal hide-footer hide-header size="a5" id="default-receipt-modal">
      <receipt-preview parentModal="default-receipt-modal" :defaultReceiptPreview='true'></receipt-preview>
    </b-modal>

    <!-- Default slip modal -->
    <b-modal hide-footer hide-header size="a5" id="default-payment-slip-modal">
      <payment-slip-preview parentModal="default-payment-slip-modal" :defaultPaymentSlipPreview='true'></payment-slip-preview>
    </b-modal>

    <h1>{{phrases.incomeCodes}}</h1>
    <income-codes-table></income-codes-table>

    <h1>{{phrases.outcomeCodes}}</h1>
    <outcome-codes-table></outcome-codes-table>
  </b-container>
</template>

<script>
  import store from '@/store'
  import { mapState } from 'vuex'
  import PaymentSlipPreview from './PaymentSlipsTable/PaymentSlipPreview'
  import ReceiptPreview from './ReceiptsTable/ReceiptPreview'
  import IncomeCodesTable from './IncomeCodesTable'
  import OutcomeCodesTable from './OutcomeCodesTable'

  const i18n = require('../../../translations/i18n')
  const defaultPaymentSlipController = require('../../../controllers/defaultPaymentSlipController')
  const defaultReceiptController = require('../../../controllers/defaultReceiptController')

  export default {
    data () {
      return {
        phrases: {
          setDefaultPaymentSlip: i18n.getTranslation('Set default values for payment slips'),
          setDefaultsReceipts: i18n.getTranslation('Set default values for receipts'),
          incomeCodes: i18n.getTranslation('Income codes'),
          outcomeCodes: i18n.getTranslation('Outcome codes'),
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
      const self = this;
      defaultPaymentSlipController.getDefaultPaymentSlip().then(function (res) {
        if (!res.err) {
          const defaultPaymentSlipFromDB = res.data
          self.$store.dispatch('SET_DEFAULT_PAYMENT_SLIP', defaultPaymentSlipFromDB)
        } else {
          showErrorDialog(res.err)
        }
      })
      defaultReceiptController.getDefaultReceipt().then(function (res) {
        if (!res.err) {
          const defaultReceiptFromDB = res.data
          self.$store.dispatch('SET_DEFAULT_RECEIPT', defaultReceiptFromDB)
        } else {
          showErrorDialog(res.err)
        }
      })
    },
    methods: {
      openDefaultReceiptModal: function () {
        this.$root.$emit('bv::show::modal', 'default-receipt-modal')
      },
      openDefaultPaymentSlipModal: function () {
        this.$root.$emit('bv::show::modal', 'default-payment-slip-modal')
      }
    },
    components: { PaymentSlipPreview, ReceiptPreview, IncomeCodesTable, OutcomeCodesTable }
  }
</script>

<style scoped>
</style>