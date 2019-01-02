<template>           
  <b-container fluid class="receipt-preview-container">
    <h1> {{receiptText.title}} </h1>
  </b-container>
</template>

<script>

const receiptText = {
  title: 'Признаница'
}

export default {
  data () {
    return {
      receiptText
    }
  }
}
</script>

<style scoped>
.receipt-preview-container {width: 842px; height: 595px}
</style>
