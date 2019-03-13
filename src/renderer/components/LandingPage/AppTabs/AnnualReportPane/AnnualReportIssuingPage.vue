<template>
  <b-container fluid class="pageDiv">
  ИЗДАВАЊА
  
  Страна <div class="underscore-div">{{ pageData.ordinal }}</div>

  У месецу <div class="underscore-div">{{ pageData.monthText }}</div>
  </b-container>
</template>

<script>
  export default {
    props: {
      pageData: {
        default: {
          ordinal: '',
          monthText: '',
          paymentSlips: [],
          receipts: [],
          total: null,
          totalIncome: null,
          totalOutcome: null,
          totalIncomePerCode: {},
          totalOutcomePerCode: {},
          transferFromPreviousMonth: null,
          transferToPreviousMonth: null
        }
      }
    }
  }
</script>

<style scoped>
  .pageDiv {
    font-family: "Times New Roman";
    font-size: 65%;
    text-align: justify;
    letter-spacing: 1px;
    border: solid 1px;
    border-color: #ddeeee;
    background-color: white;
    width: 41.9cm !important;
    height: 29.6cm !important;
    padding: 0px !important;
    margin: 0px !important;
  }
  .pageDiv .row {
    margin: 0px !important;
  }
  .underscore-div {
    border-bottom: 1px solid black;
  }
</style>