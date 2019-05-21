<template>
  <b-container fluid class="pageDiv">
    ПРИМАЊА

    Страна <div class="underscore-div">{{ pageData.ordinal }}</div>

    У месецу <div class="underscore-div">{{ pageData.monthText }}</div>

    <table>
      <tr>
        <td class="ordinal-column" rowspan="3">Редни број</td>
        <td class="day-column" rowspan="3">Дан књижења</td>
        <td class="reason-column" rowspan="3" colspan="2">КО ЈЕ И НА ИМЕ ЧЕГА УПЛАТИО</td>
        <td class="" colspan="33">ПАРТИЈА И ПОЗИЦИЈА</td>
      </tr>
      <tr>
        <td v-for="incomeCodeCombination in incomeCodeCombinations" class="part-pos-cell" colspan="2">{{ incomeCodeCombination }}</td>
        <td class="" colspan="2">УКУПНО</td>
        <td class="after-total-cell"></td>
      </tr>
      <tr>
        <template v-for="noCodes in (incomeCodeCombinations.length + 1)">
          <td class="">дин.</td>
          <td class="">п.</td>
        </template>
        <td class=""></td>
      </tr>

      <!-- Rows representing payment slips -->
      <tr  v-for="paymentSlip in pageData.paymentSlips">
        <td class="data-cell">{{ paymentSlip.ordinal }}.</td>
        <td class="data-cell">{{ paymentSlip.date | getDayFromDate }}.</td>
        <td class="data-cell reason-column" colspan="2">{{ paymentSlip.reason }}</td>
        <template v-for="incomeCodeCombination in incomeCodeCombinations">
          <td class="data-cell int-cell">{{ incomePerCodePerPaymentSlip[paymentSlip._id][incomeCodeCombination] | getInt }}</td>
          <td class="data-cell decimal-cell">{{ incomePerCodePerPaymentSlip[paymentSlip._id][incomeCodeCombination] | getDecimal }}</td>
        </template>
        <td class="data-cell int-cell">{{ paymentSlip.amount | getInt }}</td>
        <td class="data-cell decimal-cell">{{ paymentSlip.amount | getDecimal }}</td>
        <td></td>
      </tr>

      <!-- Empty table rows to have total of 26 rows per page -->
      <tr v-for="n in numberOfEmptyRows">
        <td></td>
        <td></td>
        <td colspan="2"></td>
        <td v-for="noEmptyFields in (2 * (incomeCodeCombinations.length + 1) + 1)"></td>
      </tr>
      <tr>
        <td class="totals-cell bottomless-cell rightless-cell" colspan="3"></td>
        <td class="totals-cell width-55 leftless-cell bottom-bold-cell bottom-right-content">Свега примања:</td>
        <template v-for="incomeCodeCombination in incomeCodeCombinations">
          <td class="data-cell int-cell totals-cell bottom-bold-cell">{{ pageData.totalIncomePerCode[incomeCodeCombination] | getInt }}</td>
          <td class="data-cell decimal-cell totals-cell bottom-bold-cell">{{ pageData.totalIncomePerCode[incomeCodeCombination] | getDecimal }}</td>
        </template>
        <td class="data-cell int-cell totals-cell bottom-bold-cell">{{ pageData.totalIncome | getInt }}</td>
        <td class="data-cell decimal-cell totals-cell bottom-bold-cell">{{ pageData.totalIncome | getDecimal }}</td>
        <td class="totals-cell bottom-bold-cell"></td>
      </tr>
      <tr>
        <td class="bottomless-cell topless-cell rightless-cell height-10" colspan="24"></td>
        <td class="leftless-cell bottom-bold-cell bottom-right-content height-10" colspan="10">Пренос готовине из прошлог месеца:</td>
        <td class="data-cell int-cell bottom-bold-cell height-10">{{ pageData.transferFromPreviousMonth | getInt }}</td>
        <td class="data-cell decimal-cell bottom-bold-cell height-10">{{ pageData.transferFromPreviousMonth | getDecimal }}</td>
        <td class="bottom-bold-cell height-10"></td>
      </tr>
      <tr>
        <td class="bottomless-cell topless-cell rightless-cell height-10" colspan="24"></td>
        <td class="leftless-cell bottom-bold-cell bottom-right-content height-10" colspan="10">У к у п н о:</td>
        <td class="data-cell int-cell bottom-bold-cell height-10">{{ pageData.total | getInt }}</td>
        <td class="data-cell decimal-cell bottom-bold-cell height-10">{{ pageData.total | getDecimal }}</td>
        <td class="bottom-bold-cell height-10"></td>
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
    data () {
      return {
        incomeCodeCombinations: ['I/1', 'I/2', 'I/3',
          'II/1', 'II/2', 'II/3', 'II/4', 'II/5', 'II/6',
          'III/1', 'III/2', 'III/3', 'III/4', 'III/5',
          'IV']
      }
    },
    computed: {
      numberOfEmptyRows: function () {
        if (!this.pageData || !this.pageData.paymentSlips) {
          return 26
        }
        return 26 - this.pageData.paymentSlips.length
      },
      incomePerCodePerPaymentSlip: function () {
        var incomePerCodePerPaymentSlip = {}
        this.pageData.paymentSlips.forEach(function (paymentSlip) {
          if (!incomePerCodePerPaymentSlip[paymentSlip._id]) {
            incomePerCodePerPaymentSlip[paymentSlip._id] = {}
          }
          const firstPartPos = (paymentSlip.firstPart ? paymentSlip.firstPart : '') + (paymentSlip.firstPos ? '/' + paymentSlip.firstPos : '')
          if (firstPartPos) {
            incomePerCodePerPaymentSlip[paymentSlip._id][firstPartPos] = paymentSlip.firstAmount
          }
          const secondPartPos = (paymentSlip.secondPart ? paymentSlip.secondPart : '') + (paymentSlip.secondPos ? '/' + paymentSlip.secondPos : '')
          if (secondPartPos) {
            if (!incomePerCodePerPaymentSlip[paymentSlip._id][secondPartPos]) {
              incomePerCodePerPaymentSlip[paymentSlip._id][secondPartPos] = paymentSlip.secondAmount
            } else {
              incomePerCodePerPaymentSlip[paymentSlip._id][secondPartPos] += paymentSlip.secondAmount
            }
          }
        })
        return incomePerCodePerPaymentSlip
      }
    },
    filters: {
      getDayFromDate (date) {
        const options = { day: 'numeric' }
        const language = i18n.usedLanguage
        return (new Date(date)).toLocaleDateString(language, options)
      },
      getInt (amount) {
        if (amount) {
          amount = amount + ''
          return amount.split('.')[0]
        }
        return ''
      },
      getDecimal (amount) {
        if (amount) {
          amount = amount + ''
          var decimal = amount.split('.').length > 1 ? amount.split('.')[1] : '00'
          if (decimal.length < 2) {
            decimal += '0'
          }
          return decimal
        }
        return ''
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
    border-left: 2px solid black;
    border-right: 2px solid black;
    border-top: 2px solid black;
    text-align: center;
    vertical-align: center;
    table-layout: fixed;
  }
  table td {
    height: 5mm;
    font-size: 14px;
    border: 1px solid black;
    overflow: hidden;
    word-break: normal;
  }
  table td.data-cell {
    font-weight: bold;
  }
  table .ordinal-column {
    width: 12mm;
  }
  table .day-column {
    width: 14mm;
  }
  table .reason-column {
    min-width: 83mm;
    max-width: 83mm;
  }
  table .part-pos-cell {
    height: 25mm;
    width: 15mm;
    vertical-align: top;
  }
  table .after-total-cell {
    width: 15mm;
  }
  table .decimal-cell {
    width: 5mm;
    text-align: left;
    vertical-align: bottom;
    font-size: 110%;
    padding-left: 0.5mm;
  }
  table .int-cell {
    text-align: right;
    vertical-align: bottom;
    padding-right: 0.5mm;
  }
  table td.bottomless-cell {
    border-bottom: none;
  }
  table td.bottom-bold-cell {
    border-bottom: 2px solid black;
  }
  table td.leftless-cell {
    border-left: none;
  }
  table td.rightless-cell {
    border-right: none;
  }
  table td.topless-cell {
    border-top: none;
  }
  table td.totals-cell {
    height: 20mm;
  }
  table td.bottom-right-content {
    text-align: right;
    vertical-align: bottom;
    padding-right: 2px;
  }
  table td.width-55 {
    width: 55mm;
  }
  table td.height-10 {
    height: 10mm;
  }
</style>