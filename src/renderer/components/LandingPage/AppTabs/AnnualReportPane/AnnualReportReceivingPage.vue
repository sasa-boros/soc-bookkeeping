<template>
  <b-container fluid class="pageDiv">
  ПРИМАЊА

  Страна <div class="underscore-div">{{ pageData.ordinal }}</div>

  У месецу <div class="underscore-div">{{ pageData.monthText }}</div>

  <table>
    <tr>
      <td class="ordinal-column" rowspan="3">Редни број</td>
      <td class="day-column" rowspan="3">Дан књижења</td>
      <td class="reason-column" rowspan="3">КО ЈЕ И НА ИМЕ ЧЕГА УПЛАТИО</td>
      <td class="" colspan="33">ПАРТИЈА И ПОЗИЦИЈА</td>
    </tr>
    <tr>
      <td class="part-pos-cell" colspan="2">I/1</td>
      <td class="part-pos-cell" colspan="2">I/2</td>
      <td class="part-pos-cell" colspan="2">I/3</td>
      <td class="part-pos-cell" colspan="2">II/1</td>
      <td class="part-pos-cell" colspan="2">II/2</td>
      <td class="part-pos-cell" colspan="2">II/3</td>
      <td class="part-pos-cell" colspan="2">II/4</td>
      <td class="part-pos-cell" colspan="2">II/5</td>
      <td class="part-pos-cell" colspan="2">II/6</td>
      <td class="part-pos-cell" colspan="2">III/1</td>
      <td class="part-pos-cell" colspan="2">III/2</td>
      <td class="part-pos-cell" colspan="2">III/3</td>
      <td class="part-pos-cell" colspan="2">III/4</td>
      <td class="part-pos-cell" colspan="2">III/5</td>
      <td class="part-pos-cell" colspan="2">IV</td>
      <td class="" colspan="2">УКУПНО</td>
      <td class="after-total-cell"></td>
    </tr>
    <tr>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax">дин.</td>
      <td class="tg-0lax">п.</td>
      <td class="tg-0lax"></td>
    </tr>
    <tr  v-for="paymentSlip in pageData.paymentSlips">
      <td class="tg-0lax">{{ paymentSlip.ordinal }}</td>
      <td class="tg-0lax">{{ paymentSlip.date | getDayFromDate }}</td>
      <td class="tg-0lax">{{ paymentSlip.reason }}</td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
    </tr>
    <tr v-for="n in numberOfEmptyRows">
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
      <td class="tg-0lax"></td>
    </tr>
  </table>
  </b-container>
</template>

<script>
  const i18n = require('../../../../translations/i18n')

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
    },
    computed: {
      numberOfEmptyRows: function () {
        if (!this.pageData || !this.pageData.paymentSlips) {
          return 26
        }
        return 26 - this.pageData.paymentSlips.length
      }
    },
    filters: {
      getDayFromDate (date) {
        const options = { day: 'numeric' }
        const language = i18n.usedLanguage
        return (new Date(date)).toLocaleDateString(language, options)
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
  table  {
    border-collapse: collapse;
    border-spacing: 0;
    text-align: center;
    vertical-align: center;
  }
  table td {
    height: 5mm;
    font-size: 14px;
    border: 1px solid black;
    overflow: hidden;
    word-break: normal;
  }
  table .ordinal-column {
    width: 12mm;
  }
  table .day-column {
    width: 14mm;
  }
  table .reason-column {
    width: 83mm;
  }
  table .part-pos-cell {
    height: 25mm;
    width: 15mm;
    vertical-align: top;
  }
  table .after-total-cell {
    width: 15mm;
  }
</style>