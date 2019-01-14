<template>
  <b-card no-body id="appTabsCard">
    <b-tabs card>
      <b-tab title="Receipts" active class="appTab">
        <receipts-table></receipts-table>
      </b-tab>
      <b-tab title="Payment Slips" class="appTab">
        <payment-slips-table></payment-slips-table>
      </b-tab>
      <b-tab title="Reports" class="appTab">
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
.appTab{
  display: block;
  overflow: auto;
}
</style>
