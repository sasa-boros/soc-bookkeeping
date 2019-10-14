const Big = require('big.js')

class AnnualReportPage {
  constructor() {
    this.ordinal = null
    this.paymentSlips = []
    this.receipts = []
    this.totalIncomePerCode = []
    this.totalOutcomePerCode = []
    this.totalIncome = Big(0.0)
    this.totalOutcome = Big(0.0)
    this.transferFromPreviousMonth = Big(0.0)
    this.transferToNextMonth = Big(0.0)
    this.total = Big(0.0)
  }
}

module.exports = {
  AnnualReportPage: AnnualReportPage
}
