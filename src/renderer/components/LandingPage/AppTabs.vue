<template>
        <b-card no-body>
            <b-tabs card>
                <b-tab title="Receipts" active>
                <receipts-table></receipts-table>
                </b-tab>
                <b-tab title="Payment Slips">
                <payment-slips-table></payment-slips-table>
                </b-tab>
                <b-tab title="Reports">
                </b-tab>
            </b-tabs>
        </b-card>
</template>

<script>
  import ReceiptsTable from './AppTabs/ReceiptsTable'
  import PaymentSlipsTable from './AppTabs/PaymentSlipsTable'

  export default {
    components: { ReceiptsTable, PaymentSlipsTable }
  }
</script>

<style scoped>
</style>
